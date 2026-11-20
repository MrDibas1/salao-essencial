import type { D1Database, Fetcher, ExecutionContext } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

// Helper: JSON Response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message, success: false }, status);
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Se não for rota da API, entrega os arquivos estáticos do frontend SPA
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    try {
      // -------------------------------------------------------------
      // GET /api/sync — Carrega toda a base na borda em 1 requisição
      // -------------------------------------------------------------
      if (url.pathname === '/api/sync' && request.method === 'GET') {
        const [clientsRes, aptsRes, prodsRes, settingsRes] = await Promise.all([
          env.DB.prepare('SELECT * FROM clients ORDER BY updatedAt DESC').all(),
          env.DB.prepare('SELECT * FROM appointments ORDER BY date DESC, createdAt DESC').all(),
          env.DB.prepare('SELECT * FROM products ORDER BY name ASC').all(),
          env.DB.prepare('SELECT * FROM settings WHERE id = ?').bind('main').first<{ id: string; data: string; updatedAt: string }>(),
        ]);

        const clients = (clientsRes.results || []).map((row: any) => ({
          ...row,
          isDemo: Boolean(row.isDemo),
        }));

        const appointments = (aptsRes.results || []).map((row: any) => {
          let parsedPhotos: any = null;
          if (row.photoUrls) {
            try {
              parsedPhotos = JSON.parse(row.photoUrls);
            } catch {
              parsedPhotos = null;
            }
          }
          let beforePhotoUrl = row.beforePhotoUrl || undefined;
          let afterPhotoUrl = row.afterPhotoUrl || undefined;
          let photoUrls: string[] = [];

          if (parsedPhotos) {
            if (Array.isArray(parsedPhotos)) {
              photoUrls = parsedPhotos;
              if (!beforePhotoUrl) beforePhotoUrl = parsedPhotos[0];
              if (!afterPhotoUrl && parsedPhotos.length > 1) afterPhotoUrl = parsedPhotos[1];
            } else if (typeof parsedPhotos === 'object') {
              if (parsedPhotos.before) beforePhotoUrl = parsedPhotos.before;
              if (parsedPhotos.after) afterPhotoUrl = parsedPhotos.after;
              if (Array.isArray(parsedPhotos.urls)) photoUrls = parsedPhotos.urls;
            }
          }

          return {
            ...row,
            isDemo: Boolean(row.isDemo),
            hasColorInfo: Boolean(row.hasColorInfo),
            colorFormula: row.colorFormula ? JSON.parse(row.colorFormula) : undefined,
            beforePhotoUrl,
            afterPhotoUrl,
            photoUrls,
          };
        });

        const products = (prodsRes.results || []).map((row: any) => ({
          ...row,
          isDemo: Boolean(row.isDemo),
        }));

        let settings = null;
        if (settingsRes?.data) {
          try {
            settings = JSON.parse(settingsRes.data);
          } catch {
            settings = null;
          }
        }

        return jsonResponse({
          success: true,
          data: {
            clients,
            appointments,
            products,
            settings,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // -------------------------------------------------------------
      // POST /api/sync/batch — Sincroniza em lote (para initial upload)
      // -------------------------------------------------------------
      if (url.pathname === '/api/sync/batch' && request.method === 'POST') {
        const body: any = await request.json();
        const statements: any[] = [];

        if (Array.isArray(body.clients)) {
          for (const c of body.clients) {
            statements.push(
              env.DB.prepare(`
                INSERT INTO clients (id, name, phone, whatsapp, birthDate, email, instagram, notes, avatarUrl, status, isDemo, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name = excluded.name,
                  phone = excluded.phone,
                  whatsapp = excluded.whatsapp,
                  birthDate = excluded.birthDate,
                  email = excluded.email,
                  instagram = excluded.instagram,
                  notes = excluded.notes,
                  avatarUrl = excluded.avatarUrl,
                  status = excluded.status,
                  isDemo = excluded.isDemo,
                  updatedAt = excluded.updatedAt
              `).bind(
                c.id,
                c.name,
                c.phone,
                c.whatsapp || c.phone,
                c.birthDate || null,
                c.email || null,
                c.instagram || null,
                c.notes || null,
                c.avatarUrl || null,
                c.status || 'active',
                c.isDemo ? 1 : 0,
                c.createdAt,
                c.updatedAt
              )
            );
          }
        }

        if (Array.isArray(body.appointments)) {
          for (const a of body.appointments) {
            statements.push(
              env.DB.prepare(`
                INSERT INTO appointments (id, clientId, clientName, date, professional, procedureType, customProcedureName, description, generalNotes, hasColorInfo, colorFormula, photoUrls, isDemo, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  clientId = excluded.clientId,
                  clientName = excluded.clientName,
                  date = excluded.date,
                  professional = excluded.professional,
                  procedureType = excluded.procedureType,
                  customProcedureName = excluded.customProcedureName,
                  description = excluded.description,
                  generalNotes = excluded.generalNotes,
                  hasColorInfo = excluded.hasColorInfo,
                  colorFormula = excluded.colorFormula,
                  photoUrls = excluded.photoUrls,
                  isDemo = excluded.isDemo,
                  updatedAt = excluded.updatedAt
              `).bind(
                a.id,
                a.clientId,
                a.clientName,
                a.date,
                a.professional,
                a.procedureType,
                a.customProcedureName || null,
                a.description,
                a.generalNotes || null,
                a.hasColorInfo ? 1 : 0,
                a.colorFormula ? JSON.stringify(a.colorFormula) : null,
                (a.beforePhotoUrl || a.afterPhotoUrl || a.photoUrls)
                  ? JSON.stringify({
                      before: a.beforePhotoUrl || null,
                      after: a.afterPhotoUrl || null,
                      urls: a.photoUrls || [],
                    })
                  : null,
                a.isDemo ? 1 : 0,
                a.createdAt,
                a.updatedAt || a.createdAt
              )
            );
          }
        }

        if (Array.isArray(body.products)) {
          for (const p of body.products) {
            statements.push(
              env.DB.prepare(`
                INSERT INTO products (id, name, brand, line, category, shadeNumber, unit, notes, imageUrl, isDemo, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name = excluded.name,
                  brand = excluded.brand,
                  line = excluded.line,
                  category = excluded.category,
                  shadeNumber = excluded.shadeNumber,
                  unit = excluded.unit,
                  notes = excluded.notes,
                  imageUrl = excluded.imageUrl,
                  isDemo = excluded.isDemo,
                  updatedAt = excluded.updatedAt
              `).bind(
                p.id,
                p.name,
                p.brand,
                p.line || null,
                p.category,
                p.shadeNumber || null,
                p.unit || 'tubo 60g',
                p.notes || null,
                p.imageUrl || null,
                p.isDemo ? 1 : 0,
                p.createdAt,
                p.updatedAt || p.createdAt
              )
            );
          }
        }

        if (body.settings) {
          const now = new Date().toISOString();
          statements.push(
            env.DB.prepare(`
              INSERT INTO settings (id, data, updatedAt)
              VALUES ('main', ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                data = excluded.data,
                updatedAt = excluded.updatedAt
            `).bind(JSON.stringify(body.settings), now)
          );
        }

        if (statements.length > 0) {
          await env.DB.batch(statements);
        }

        return jsonResponse({ success: true, count: statements.length });
      }

      // -------------------------------------------------------------
      // CLIENTES CRUD
      // -------------------------------------------------------------
      if (url.pathname === '/api/clients' && request.method === 'POST') {
        const c: any = await request.json();
        const now = new Date().toISOString();
        const id = c.id || `cli-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const createdAt = c.createdAt || now;
        const updatedAt = now;

        await env.DB.prepare(`
          INSERT INTO clients (id, name, phone, whatsapp, birthDate, email, instagram, notes, avatarUrl, status, isDemo, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            phone = excluded.phone,
            whatsapp = excluded.whatsapp,
            birthDate = excluded.birthDate,
            email = excluded.email,
            instagram = excluded.instagram,
            notes = excluded.notes,
            avatarUrl = excluded.avatarUrl,
            status = excluded.status,
            updatedAt = excluded.updatedAt
        `).bind(
          id,
          c.name,
          c.phone,
          c.whatsapp || c.phone,
          c.birthDate || null,
          c.email || null,
          c.instagram || null,
          c.notes || null,
          c.avatarUrl || null,
          c.status || 'active',
          c.isDemo ? 1 : 0,
          createdAt,
          updatedAt
        ).run();

        return jsonResponse({ success: true, client: { ...c, id, createdAt, updatedAt } });
      }

      if (url.pathname.startsWith('/api/clients/') && request.method === 'DELETE') {
        const id = url.pathname.replace('/api/clients/', '');
        await env.DB.prepare('DELETE FROM clients WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, id });
      }

      // -------------------------------------------------------------
      // ATENDIMENTOS CRUD
      // -------------------------------------------------------------
      if (url.pathname === '/api/appointments' && request.method === 'POST') {
        const a: any = await request.json();
        const now = new Date().toISOString();
        const id = a.id || `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const createdAt = a.createdAt || now;
        const updatedAt = now;

        await env.DB.prepare(`
          INSERT INTO appointments (id, clientId, clientName, date, professional, procedureType, customProcedureName, description, generalNotes, hasColorInfo, colorFormula, photoUrls, isDemo, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            clientId = excluded.clientId,
            clientName = excluded.clientName,
            date = excluded.date,
            professional = excluded.professional,
            procedureType = excluded.procedureType,
            customProcedureName = excluded.customProcedureName,
            description = excluded.description,
            generalNotes = excluded.generalNotes,
            hasColorInfo = excluded.hasColorInfo,
            colorFormula = excluded.colorFormula,
            photoUrls = excluded.photoUrls,
            updatedAt = excluded.updatedAt
        `).bind(
          id,
          a.clientId,
          a.clientName,
          a.date,
          a.professional,
          a.procedureType,
          a.customProcedureName || null,
          a.description,
          a.generalNotes || null,
          a.hasColorInfo ? 1 : 0,
          a.colorFormula ? JSON.stringify(a.colorFormula) : null,
          (a.beforePhotoUrl || a.afterPhotoUrl || a.photoUrls)
            ? JSON.stringify({
                before: a.beforePhotoUrl || null,
                after: a.afterPhotoUrl || null,
                urls: a.photoUrls || [],
              })
            : null,
          a.isDemo ? 1 : 0,
          createdAt,
          updatedAt
        ).run();

        return jsonResponse({ success: true, appointment: { ...a, id, createdAt, updatedAt } });
      }

      if (url.pathname.startsWith('/api/appointments/') && request.method === 'DELETE') {
        const id = url.pathname.replace('/api/appointments/', '');
        await env.DB.prepare('DELETE FROM appointments WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, id });
      }

      // -------------------------------------------------------------
      // PRODUTOS CRUD
      // -------------------------------------------------------------
      if (url.pathname === '/api/products' && request.method === 'POST') {
        const p: any = await request.json();
        const now = new Date().toISOString();
        const id = p.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const createdAt = p.createdAt || now;
        const updatedAt = now;

        await env.DB.prepare(`
          INSERT INTO products (id, name, brand, line, category, shadeNumber, unit, notes, imageUrl, isDemo, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            brand = excluded.brand,
            line = excluded.line,
            category = excluded.category,
            shadeNumber = excluded.shadeNumber,
            unit = excluded.unit,
            notes = excluded.notes,
            imageUrl = excluded.imageUrl,
            updatedAt = excluded.updatedAt
        `).bind(
          id,
          p.name,
          p.brand,
          p.line || null,
          p.category,
          p.shadeNumber || null,
          p.unit || 'tubo 60g',
          p.notes || null,
          p.imageUrl || null,
          p.isDemo ? 1 : 0,
          createdAt,
          updatedAt
        ).run();

        return jsonResponse({ success: true, product: { ...p, id, createdAt, updatedAt } });
      }

      if (url.pathname.startsWith('/api/products/') && request.method === 'DELETE') {
        const id = url.pathname.replace('/api/products/', '');
        await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, id });
      }

      // -------------------------------------------------------------
      // SETTINGS
      // -------------------------------------------------------------
      if (url.pathname === '/api/settings' && request.method === 'POST') {
        const s: any = await request.json();
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO settings (id, data, updatedAt)
          VALUES ('main', ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            data = excluded.data,
            updatedAt = excluded.updatedAt
        `).bind(JSON.stringify(s), now).run();

        return jsonResponse({ success: true, settings: s });
      }

      // -------------------------------------------------------------
      // DEMO MANAGEMENT
      // -------------------------------------------------------------
      if (url.pathname === '/api/demo/clear' && request.method === 'POST') {
        await env.DB.batch([
          env.DB.prepare('DELETE FROM clients WHERE isDemo = 1'),
          env.DB.prepare('DELETE FROM appointments WHERE isDemo = 1'),
          env.DB.prepare('DELETE FROM products WHERE isDemo = 1'),
        ]);
        return jsonResponse({ success: true, message: 'Dados demonstrativos removidos do banco Cloudflare D1.' });
      }

      return errorResponse('Endpoint não encontrado', 404);
    } catch (err: any) {
      console.error('Erro na API D1:', err);
      return errorResponse(err?.message || 'Erro interno no servidor', 500);
    }
  },
};
