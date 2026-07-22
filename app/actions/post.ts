'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface PublishPostPayload {
  title?: string;
  caption: string;
  mediaUrls: string[];
  platforms: string[];
  orgId?: string;
}

export async function publishPostAction(payload: PublishPostPayload) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_CENTRAL_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_CENTRAL_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {}
          },
        },
      }
    );

    // 1. Obtener usuario o perfil si está autenticado
    const { data: { user } } = await supabase.auth.getUser();

    let targetOrgId = payload.orgId;
    let creatorId = user?.id;

    if (user && !targetOrgId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();
      if (profile?.org_id) {
        targetOrgId = profile.org_id;
      }
    }

    // 2. Guardar Causa / Publicación en Supabase si hay cliente configurado
    let causeId: string | undefined;

    if (process.env.NEXT_PUBLIC_SUPABASE_CENTRAL_URL) {
      const { data: cause, error: dbError } = await supabase
        .from('causes')
        .insert({
          org_id: targetOrgId || null,
          creator_id: creatorId || null,
          title: payload.title || 'Publicación sin título',
          description: payload.caption,
          media_url: payload.mediaUrls[0] || '',
          status: 'approved',
        })
        .select('id')
        .single();

      if (!dbError && cause) {
        causeId = cause.id;
      }
    }

    // 3. Obtener la URL del Webhook de n8n
    let webhookUrl: string | undefined = process.env.N8N_WEBHOOK_URL;

    if (targetOrgId && process.env.NEXT_PUBLIC_SUPABASE_CENTRAL_URL) {
      const { data: orgData } = await supabase
        .from('organizations')
        .select('settings')
        .eq('id', targetOrgId)
        .single();

      if (orgData?.settings?.n8n_webhook_url) {
        webhookUrl = orgData.settings.n8n_webhook_url;
      }
    }

    // 4. Disparar Webhook a n8n para envío a redes sociales
    let webhookDispatched = false;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'post_published',
            cause_id: causeId,
            caption: payload.caption,
            media_urls: payload.mediaUrls,
            platforms: payload.platforms,
            org_id: targetOrgId,
            timestamp: new Date().toISOString(),
          }),
        });
        webhookDispatched = true;
      } catch (webhookErr) {
        console.error('Error enviando webhook a n8n:', webhookErr);
      }
    }

    return {
      success: true,
      causeId,
      webhookDispatched,
      message: '¡Publicación enviada y procesada exitosamente!',
    };
  } catch (error: any) {
    console.error('Error publicando post:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al publicar.',
    };
  }
}
