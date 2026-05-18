/* ═══════════════════════════════════════════════════════════
   POPUP CONCIERGERIE – KreoLocation
   → Fichier séparé : pour supprimer le popup, 
     il suffit de retirer la ligne <script src="popup.js">
     dans index.html. Rien d'autre à toucher.
═══════════════════════════════════════════════════════════ */

(function () {

  /* ── Styles du popup injectés dynamiquement ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Fond sombre derrière le popup */
    #kl-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 35, 25, 0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: klFadeIn 0.4s ease forwards;
    }

    /* Boîte principale */
    #kl-popup {
      background: #FFFFFF;
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 32px 80px rgba(27,58,45,0.35);
      animation: klSlideUp 0.5s cubic-bezier(0,0,0.2,1) forwards;
      position: relative;
    }

    /* Bandeau vert en haut */
    #kl-popup-header {
      background: #1B3A2D;
      padding: 28px 32px 24px;
      position: relative;
    }

    /* Pastille "Nouveau" */
    #kl-popup-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(168,213,190,0.15);
      border: 1px solid rgba(168,213,190,0.3);
      color: #a8d5be;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 20px;
      margin-bottom: 14px;
    }

    #kl-popup-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-weight: 700;
      color: #FFFFFF;
      line-height: 1.15;
      margin-bottom: 8px;
    }

    #kl-popup-title em {
      font-style: italic;
      font-weight: 400;
      color: #a8d5be;
    }

    #kl-popup-subtitle {
      font-size: 0.85rem;
      font-weight: 300;
      color: rgba(255,255,255,0.6);
      line-height: 1.6;
    }

    /* Contenu blanc */
    #kl-popup-body {
      padding: 24px 32px 28px;
    }

    /* Les 3 points clés */
    #kl-popup-points {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    #kl-popup-points li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.88rem;
      color: #5A5A56;
      line-height: 1.6;
    }

    #kl-popup-points li .kl-icon {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 8px;
      background: #EEF5EC;
      border: 1px solid #D8EAD3;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2D6A4F;
      margin-top: 1px;
    }

    #kl-popup-points li strong {
      display: block;
      font-weight: 700;
      color: #1B3A2D;
      margin-bottom: 2px;
      font-size: 0.9rem;
    }

    /* Boutons */
    #kl-popup-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    #kl-popup-cta {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #2D6A4F;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 14px 20px;
      font-family: 'Nunito Sans', system-ui, sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(45,106,79,0.3);
      transition: background 0.25s ease, transform 0.25s ease;
      white-space: nowrap;
    }
    #kl-popup-cta:hover {
      background: #1B3A2D;
      transform: translateY(-2px);
    }

    #kl-popup-close {
      background: #F2EFE9;
      color: #5A5A56;
      border: 1px solid #E5E0D8;
      border-radius: 8px;
      padding: 14px 18px;
      font-family: 'Nunito Sans', system-ui, sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.25s ease;
      white-space: nowrap;
    }
    #kl-popup-close:hover { background: #E5E0D8; }

    /* Bouton X en haut à droite */
    #kl-popup-x {
      position: absolute;
      top: 14px;
      right: 14px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.7);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      transition: background 0.2s ease;
    }
    #kl-popup-x:hover { background: rgba(255,255,255,0.2); }

    /* Animations */
    @keyframes klFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes klSlideUp {
      from { opacity: 0; transform: translateY(40px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Fermeture */
    #kl-popup-overlay.closing {
      animation: klFadeIn 0.3s ease reverse forwards;
    }

    /* Mobile */
    @media (max-width: 480px) {
      #kl-popup-header { padding: 22px 20px 18px; }
      #kl-popup-body   { padding: 20px 20px 22px; }
      #kl-popup-actions { flex-direction: column; }
      #kl-popup-cta, #kl-popup-close { width: 100%; justify-content: center; }
    }
  `;
  document.head.appendChild(style);

  /* ── Structure HTML du popup ── */
  const overlay = document.createElement('div');
  overlay.id = 'kl-popup-overlay';
  overlay.innerHTML = `
    <div id="kl-popup" role="dialog" aria-modal="true" aria-labelledby="kl-popup-title">

      <!-- Bandeau vert -->
      <div id="kl-popup-header">
        <button id="kl-popup-x" aria-label="Fermer">✕</button>
        <div id="kl-popup-badge">
          🇷🇪 &nbsp;KreoLocation — La Réunion
        </div>
        <h2 id="kl-popup-title">
          Notre flotte arrive<br/>bientôt — mais on est <em>déjà là !</em>
        </h2>
        <p id="kl-popup-subtitle">
          En attendant nos véhicules, un service est déjà disponible pour vous.
        </p>
      </div>

      <!-- Corps -->
      <div id="kl-popup-body">
        <ul id="kl-popup-points">
          <li>
            <div class="kl-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <strong>Vous avez une voiture qui dort ?</strong>
              On la loue pour vous sur les plateformes. Vous donnez juste les clés — on s'occupe de tout.
            </div>
          </li>
          <li>
            <div class="kl-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <strong>Vous touchez 75% des revenus</strong>
              On prend seulement 25% de commission. Si on ne loue pas, vous ne payez rien. Zéro risque.
            </div>
          </li>
          <li>
            <div class="kl-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <strong>Réponse en moins de 15 minutes</strong>
              Contactez-nous sur WhatsApp — on est disponible 7j/7 🇷🇪
            </div>
          </li>
        </ul>

        <!-- Boutons -->
        <div id="kl-popup-actions">
          <a
            id="kl-popup-cta"
            href="https://wa.me/262693486295?text=Bonjour%20KreoLocation%20%F0%9F%91%8B%20J%27ai%20une%20voiture%20inutilis%C3%A9e%20et%20je%20veux%20en%20savoir%20plus%20sur%20votre%20service%20de%20gestion."
            target="_blank"
            rel="noopener noreferrer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Je veux confier mon véhicule
          </a>
          <button id="kl-popup-close">Voir le site</button>
        </div>
      </div>

    </div>
  `;

  /* ── Fonction de fermeture ── */
  function closePopup() {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }

  /* ── Événements de fermeture ── */
  overlay.querySelector('#kl-popup-x').addEventListener('click', closePopup);
  overlay.querySelector('#kl-popup-close').addEventListener('click', closePopup);
  // Clic sur le fond sombre
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });
  // Touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  /* ── Affichage après 1 seconde ── */
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => document.body.appendChild(overlay), 1000);
  });

})();
