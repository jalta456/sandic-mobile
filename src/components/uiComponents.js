/**
 * src/components/uiComponents.js
 * Fonctions de composants UI réutilisables.
 */

window.ComposantsUI = {

    // ===== CARTES LISTE =====

    carteProprietaire(o) {
        const paiementsMois = (DonneesApp.paiements || []).filter(p =>
            p.idProprietaire === o.id &&
            p.annee === new Date().getFullYear().toString()
        );
        const nbMoisPaies = paiementsMois.length;
        const estEnRetard = o.statut !== 'paid';

        return `
            <div class="item-card" role="listitem" tabindex="0" onclick="ControleurUI.ouvrirProfilProprietaire(${o.id})" style="cursor:pointer">
                <div class="item-visual" style="background: ${estEnRetard ? '#e74c3c' : 'var(--primary)'}22; color: ${estEnRetard ? '#e74c3c' : 'var(--primary)'}">
                    <i class="fas fa-user" aria-hidden="true"></i>
                </div>
                <div class="item-content">
                    <p class="title-lg" style="font-size: 1rem">${o.nom}</p>
                    <p class="body-md">شقة ${o.appartement} • ${o.type}</p>
                    <p class="body-md" style="font-size:0.75rem; color: ${estEnRetard ? '#e74c3c' : 'var(--primary)'}">
                        ${nbMoisPaies} شهر مدفوع • ${estEnRetard ? '⚠ متأخر' : '✓ نظيف'}
                    </p>
                </div>
                <div class="item-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="ControleurUI.ouvrirWhatsApp('${o.telephone}', 'payment_reminder')" aria-label="WhatsApp تذكير">
                        <i class="fab fa-whatsapp" style="color: #25D366"></i>
                    </button>
                    <span class="badge ${o.statut === 'paid' ? 'badge-paid' : 'badge-pending'}">
                        ${o.statut === 'paid' ? 'مدفوع' : 'معلق'}
                    </span>
                </div>
            </div>`;
    },

    carteDepense(ex) {
        const icones = { 'صيانة': 'fa-tools', 'مرافق': 'fa-bolt', 'نظافة': 'fa-broom', 'أخرى': 'fa-file-invoice-dollar' };
        const icone = icones[ex.categorie] || ex.icone || 'fa-money-bill';
        return `
            <div class="item-card" role="listitem" tabindex="0">
                <div class="item-visual" style="background:#e74c3c22;color:#e74c3c">
                    <i class="fas ${icone}" aria-hidden="true"></i>
                </div>
                <div class="item-content">
                    <p class="title-lg" style="font-size: 1rem">${ex.titre}</p>
                    <p class="body-md">${ex.categorie} • ${ex.date || ex.dateIso}</p>
                </div>
                <div class="item-value">
                    <p style="color: #e74c3c; font-size: 1.1rem; font-weight:700">-${(ex.montant||0).toLocaleString()} DH</p>
                </div>
            </div>`;
    },

    cartePaiement(p) {
        const nomProprietaire = SelecteursDonnees.obtenirNomProprietaire(p.idProprietaire);
        const proprietaire = DonneesApp.proprietaires.find(o => o.id === p.idProprietaire);
        return `
            <div class="item-card" role="listitem" tabindex="0">
                <div class="item-visual" style="background:var(--primary-container); color:var(--primary)">
                    <i class="fas fa-calendar-check" aria-hidden="true"></i>
                </div>
                <div class="item-content">
                    <p class="title-lg" style="font-size: 1rem">${nomProprietaire}</p>
                    <p class="body-md">واجب ${p.mois} ${p.annee} • شقة ${proprietaire ? proprietaire.appartement : '-'}</p>
                    <p class="body-md" style="font-size:0.7rem">${p.date || p.dateIso}</p>
                </div>
                <div class="item-value">
                    <p style="color: var(--primary); font-size: 1.1rem; font-weight:700">+${(p.montant||0).toLocaleString()} DH</p>
                    <span class="badge badge-paid" style="font-size:0.65rem">✓ مكتمل</span>
                </div>
            </div>`;
    },

    carteProjet(p) {
        const pourcentage = Math.min(100, Math.round((p.collecte / p.budget) * 100)) || p.progression || 0;
        const contributions = p.contributions || [];
        const nbProp = DonneesApp.proprietaires.length;
        const nbPayes = contributions.length;
        const couleurBarre = pourcentage >= 100 ? '#2ecc71' : pourcentage >= 50 ? 'var(--primary)' : '#e67e22';
        return `
            <div class="card" tabindex="0" style="cursor:pointer" onclick="ControleurUI.ouvrirDetailProjet(${p.id})">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <div style="flex:1">
                        <p class="title-lg" style="font-size:1.05rem">${p.titre}</p>
                        <p class="body-md" style="margin:0.25rem 0;font-size:0.8rem">${p.description || ''}</p>
                    </div>
                    <span class="badge ${pourcentage >= 100 ? 'badge-paid' : 'badge-pending'}">${pourcentage}%</span>
                </div>
                <div style="height:8px;background:var(--surface-container-low);border-radius:4px;margin:0.75rem 0;overflow:hidden">
                    <div style="width:${pourcentage}%;height:100%;background:${couleurBarre};transition:width 0.5s ease;border-radius:4px"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
                    <p class="body-md" style="font-size:0.8rem">الميزانية: <b>${(p.budget||0).toLocaleString()} DH</b></p>
                    <p class="body-md" style="font-size:0.8rem">المجمع: <b style="color:${couleurBarre}">${(p.collecte||0).toLocaleString()} DH</b></p>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:0.5rem;border-top:1px solid var(--outline-variant)">
                    <div style="display:flex;align-items:center;gap:0.4rem">
                        <div style="display:flex;gap:2px">
                            ${Array.from({length: nbProp}, (_,i) => {
                                const prop = DonneesApp.proprietaires[i];
                                const payé = prop && contributions.some(c => c.idProprietaire === prop.id);
                                return `<div style="width:8px;height:8px;border-radius:50%;background:${payé?'#2ecc71':'#e74c3c11'};border:1px solid ${payé?'#2ecc71':'#e74c3c'}"></div>`;
                            }).join('')}
                        </div>
                        <p style="font-size:0.72rem;color:${nbPayes===nbProp?'#2ecc71':'#e67e22'}">
                            ${nbPayes}/${nbProp} شقة دفعت
                        </p>
                    </div>
                    <span style="font-size:0.75rem;color:var(--primary);font-weight:600">
                        <i class="fas fa-eye"></i> التفاصيل
                    </span>
                </div>
                ${p.part ? `<p class="body-md" style="margin-top:0.4rem;font-size:0.72rem;opacity:0.6">المساهمة/شقة: <b>${p.part} DH</b></p>` : ''}
            </div>`;
    },

    modalDetailProjet(p) {
        const contributions = p.contributions || [];
        const pourcentage = Math.min(100, Math.round((p.collecte / p.budget) * 100)) || p.progression || 0;
        const nbProp = DonneesApp.proprietaires.length;
        const nbPayes = contributions.length;
        const totalCollecte = contributions.reduce((s,c) => s+(c.montant||0), 0);
        const couleurBarre = pourcentage >= 100 ? '#2ecc71' : pourcentage >= 50 ? 'var(--primary)' : '#e67e22';

        const lignesProp = DonneesApp.proprietaires.map(o => {
            const contrib = contributions.find(c => c.idProprietaire === o.id);
            return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid var(--outline-variant)">
                <div style="display:flex;align-items:center;gap:0.6rem">
                    <div style="width:36px;height:36px;border-radius:50%;background:${contrib?'#2ecc7122':'#e74c3c11'};color:${contrib?'#2ecc71':'#e74c3c'};display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0">
                        <i class="fas ${contrib?'fa-check':'fa-times'}"></i>
                    </div>
                    <div>
                        <p style="font-size:0.88rem;font-weight:600">${o.nom}</p>
                        <p style="font-size:0.72rem;opacity:0.6">شقة ${o.appartement}</p>
                    </div>
                </div>
                <div style="text-align:left">
                    ${contrib
                        ? `<p style="color:#2ecc71;font-weight:700;font-size:0.85rem">+${contrib.montant} DH</p>
                           <p style="font-size:0.65rem;opacity:0.6">${contrib.date}</p>`
                        : `<button onclick="ControleurUI.enregistrerContribProjet(${p.id},${o.id})"
                              style="background:#e67e2222;color:#e67e22;border:1px solid #e67e2244;border-radius:8px;padding:0.3rem 0.6rem;font-size:0.72rem;cursor:pointer;font-family:inherit">
                              <i class="fas fa-plus"></i> تسجيل
                           </button>`
                    }
                </div>
            </div>`;
        }).join('');

        return `
        <div id="modalProjet" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:flex-end" onclick="if(event.target===this)ControleurUI.fermerModalProjet()">
            <div style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-height:85vh;overflow-y:auto;padding:1.2rem;font-family:Cairo,sans-serif" dir="rtl">
                <!-- مقبض السحب -->
                <div style="width:40px;height:4px;background:var(--outline-variant);border-radius:2px;margin:0 auto 1rem"></div>

                <!-- رأس المشروع -->
                <div style="margin-bottom:1rem">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">
                        <div>
                            <p style="font-size:1.1rem;font-weight:700">${p.titre}</p>
                            <p style="font-size:0.8rem;opacity:0.7">${p.description}</p>
                        </div>
                        <button onclick="ControleurUI.fermerModalProjet()" style="background:var(--surface-container);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1rem;color:var(--on-surface)">✕</button>
                    </div>
                    <!-- شريط التقدم -->
                    <div style="height:10px;background:var(--surface-container);border-radius:5px;overflow:hidden;margin:0.75rem 0">
                        <div style="height:100%;width:${pourcentage}%;background:linear-gradient(90deg,${couleurBarre},${couleurBarre}cc);border-radius:5px;transition:width 0.5s"></div>
                    </div>
                    <!-- إحصاء سريع -->
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:0.75rem">
                        <div style="background:var(--surface-container);border-radius:10px;padding:0.6rem;text-align:center">
                            <p style="font-size:0.65rem;opacity:0.7">الميزانية</p>
                            <p style="font-size:0.85rem;font-weight:700">${(p.budget||0).toLocaleString()}<span style="font-size:0.6rem"> DH</span></p>
                        </div>
                        <div style="background:#2ecc7122;border-radius:10px;padding:0.6rem;text-align:center">
                            <p style="font-size:0.65rem;opacity:0.7">المحصّل</p>
                            <p style="font-size:0.85rem;font-weight:700;color:#2ecc71">${totalCollecte.toLocaleString()}<span style="font-size:0.6rem"> DH</span></p>
                        </div>
                        <div style="background:${nbPayes===nbProp?'#2ecc7122':'#e74c3c11'};border-radius:10px;padding:0.6rem;text-align:center">
                            <p style="font-size:0.65rem;opacity:0.7">الشقق</p>
                            <p style="font-size:0.85rem;font-weight:700;color:${nbPayes===nbProp?'#2ecc71':'#e74c3c'}">${nbPayes}/${nbProp}</p>
                        </div>
                    </div>
                </div>

                <!-- قائمة الملاك -->
                <p style="font-size:0.85rem;font-weight:700;margin-bottom:0.5rem;opacity:0.8">📋 حالة مساهمة الملاك</p>
                <div>${lignesProp}</div>

                <!-- زر WhatsApp -->
                <button onclick="ControleurUI.envoyerRapportProjetWhatsApp(${p.id})"
                    style="width:100%;margin-top:1rem;background:#25D366;color:white;border:none;border-radius:12px;padding:0.9rem;font-size:0.9rem;cursor:pointer;font-family:Cairo,sans-serif;display:flex;align-items:center;justify-content:center;gap:0.5rem">
                    <i class="fab fa-whatsapp"></i> تذكير المتأخرين عبر WhatsApp
                </button>
            </div>
        </div>`;
    },

    carteAnnonce(a) {
        const couleurPriorite = a.priorite === 'high' ? '#e74c3c' : 'var(--primary)';
        const labelPriorite = a.priorite === 'high' ? 'مهم جداً' : 'عادي';
        return `
            <div class="card" style="box-shadow: -4px 0 0 ${couleurPriorite}" tabindex="0">
                <p class="title-lg" style="font-size: 1.1rem">${a.titre}</p>
                <p class="body-md" style="margin: 0.5rem 0">${a.contenu}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.5rem">
                    <p class="body-md" style="font-size: 0.75rem">${a.date || a.dateIso}</p>
                    <span class="badge" style="background: ${couleurPriorite}22; color: ${couleurPriorite}">${labelPriorite}</span>
                </div>
            </div>`;
    },

    carteRapport(titre, valeur, sousTexte, icone, couleur = 'var(--primary)') {
        return `
            <div class="card" style="display:flex;align-items:center;gap:1rem">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: ${couleur}22; color: ${couleur}; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink:0">
                    <i class="fas ${icone}"></i>
                </div>
                <div>
                    <p class="body-md">${titre}</p>
                    <p class="title-lg" style="font-size: 1.25rem">${valeur}</p>
                    <p class="body-md" style="font-size: 0.75rem; opacity: 0.7">${sousTexte}</p>
                </div>
            </div>`;
    },

    etatVide(message, icone = "fa-folder-open") {
        return `
            <div class="empty-state" style="text-align: center; padding: 3rem 1rem; opacity: 0.6">
                <i class="fas ${icone} mb-3" style="font-size: 2.5rem; display: block; margin-bottom:0.75rem"></i>
                <p class="body-md">${message}</p>
            </div>`;
    },

    controleFiltreSegmente(filtreActif = 'all') {
        const filtres = [
            { id: 'month', label: 'هذا الشهر' },
            { id: 'year', label: 'هذه السنة' },
            { id: 'all', label: 'الكل' }
        ];
        return `
            <div class="segmented-control" style="display:flex;gap:0.5rem;background:var(--surface-container-low);padding:0.25rem;border-radius:12px;margin-bottom:1rem">
                ${filtres.map(f => `
                    <button class="segment-item ${filtreActif === f.id ? 'active' : ''}"
                            onclick="window.ControleurUI.gererChangementFiltre('${f.id}')"
                            style="flex:1;padding:0.5rem;border:none;border-radius:10px;cursor:pointer;font-size:0.85rem;transition:all 0.2s;background:${filtreActif === f.id ? 'var(--primary)' : 'transparent'};color:${filtreActif === f.id ? 'white' : 'inherit'}">
                        ${f.label}
                    </button>
                `).join('')}
            </div>`;
    },

    carteRetards(donnees) {
        return `
            <div class="card" style="background: rgba(231, 76, 60, 0.05); border: 1px dashed #e74c3c">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
                    <p class="title-lg" style="color: #e74c3c; font-size: 1rem">⚠ المتأخرات</p>
                    <span class="badge" style="background:#e74c3c22;color:#e74c3c">${donnees.nb} مالك</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:${donnees.details && donnees.details.length ? '1rem' : '0'}">
                    <div>
                        <p class="body-md">عدد الملاك المتأخرين</p>
                        <p class="title-lg" style="font-size: 1.5rem; color:#e74c3c">${donnees.nb}</p>
                    </div>
                    <div>
                        <p class="body-md">المبلغ الإجمالي المستحق</p>
                        <p class="title-lg" style="font-size: 1.5rem; color:#e74c3c">${(donnees.montantTotal||0).toLocaleString()} DH</p>
                    </div>
                </div>
                ${donnees.details && donnees.details.length ? `
                    <div style="border-top:1px solid #e74c3c33;padding-top:0.75rem">
                        ${donnees.details.map(d => `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;border-bottom:1px solid var(--outline-variant)">
                                <div>
                                    <p style="font-size:0.9rem;font-weight:600">${d.nom}</p>
                                    <p class="body-md" style="font-size:0.75rem">شقة ${d.appartement}</p>
                                </div>
                                <div style="text-align:left">
                                    <p style="color:#e74c3c;font-weight:700;font-size:0.9rem">${d.montant} DH</p>
                                    <button onclick="ControleurUI.ouvrirWhatsApp('${d.telephone}', 'payment_reminder')" 
                                            style="background:#25D36622;color:#25D366;border:none;border-radius:6px;padding:0.2rem 0.5rem;font-size:0.7rem;cursor:pointer">
                                        <i class="fab fa-whatsapp"></i> تذكير
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>`;
    },

    // ===== PROFIL DÉTAILLÉ DU PROPRIÉTAIRE =====

    pageProfilProprietaire(proprietaire) {
        const paiementsProprietaire = DonneesApp.paiements.filter(p => p.idProprietaire === proprietaire.id);
        const moisArabes = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
        const anneeActuelle = new Date().getFullYear().toString();
        const moisActuelIndex = new Date().getMonth();

        const moisStatuts = moisArabes.slice(0, moisActuelIndex + 1).map(m => {
            const paiement = paiementsProprietaire.find(p => p.mois === m && p.annee === anneeActuelle);
            return { mois: m, paye: !!paiement, montant: paiement ? paiement.montant : 0 };
        });

        const totalPaye = paiementsProprietaire
            .filter(p => p.annee === anneeActuelle)
            .reduce((s, p) => s + (p.montant || 0), 0);
        const moisEnRetard = moisStatuts.filter(m => !m.paye).length;

        return `
            <div style="padding: 1rem">
                <!-- En-tête du profil -->
                <div class="card bento-hero" style="margin-bottom:1rem;text-align:center;padding:1.5rem">
                    <div style="width:70px;height:70px;border-radius:50%;background:${moisEnRetard > 0 ? '#e74c3c' : 'var(--primary)'}22;color:${moisEnRetard > 0 ? '#e74c3c' : 'var(--primary)'};display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1rem">
                        <i class="fas fa-user"></i>
                    </div>
                    <h2 class="headline-sm" style="margin-bottom:0.25rem">${proprietaire.nom}</h2>
                    <p class="body-md">شقة ${proprietaire.appartement} • ${proprietaire.type}</p>
                    <p class="body-md" style="margin-top:0.25rem;direction:ltr">${proprietaire.telephone || 'لا يوجد هاتف'}</p>
                    <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap">
                        <button onclick="ControleurUI.ouvrirWhatsApp('${proprietaire.telephone}', 'payment_reminder')"
                                style="background:#25D366;color:white;border:none;border-radius:10px;padding:0.6rem 1.2rem;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem">
                            <i class="fab fa-whatsapp"></i> إرسال تذكير
                        </button>
                        <button onclick="ControleurUI.ouvrirModalParVuePourProprietaire(${proprietaire.id})"
                                style="background:var(--primary);color:white;border:none;border-radius:10px;padding:0.6rem 1.2rem;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem">
                            <i class="fas fa-plus"></i> تسجيل أداء
                        </button>
                        <button onclick="ControleurUI.ouvrirModificationProprietaire(${proprietaire.id})"
                                style="background:var(--surface-container);color:var(--on-surface);border:1px solid var(--outline);border-radius:10px;padding:0.6rem 1.2rem;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button onclick="ControleurUI.supprimerProprietaire(${proprietaire.id}, '${proprietaire.nom}')"
                                style="background:#e74c3c22;color:#e74c3c;border:1px solid #e74c3c44;border-radius:10px;padding:0.6rem 1.2rem;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>

                <!-- Résumé financier -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">
                    <div class="card" style="text-align:center;padding:1rem">
                        <p class="body-md" style="font-size:0.8rem">مجموع المدفوعات ${anneeActuelle}</p>
                        <p class="title-lg" style="font-size:1.5rem;color:var(--primary)">${totalPaye.toLocaleString()} DH</p>
                    </div>
                    <div class="card" style="text-align:center;padding:1rem">
                        <p class="body-md" style="font-size:0.8rem">أشهر في التأخر</p>
                        <p class="title-lg" style="font-size:1.5rem;color:${moisEnRetard > 0 ? '#e74c3c' : 'var(--primary)'}">${moisEnRetard}</p>
                    </div>
                </div>

                <!-- Grille des mois -->
                <div class="card" style="margin-bottom:1rem">
                    <p class="title-lg" style="font-size:0.95rem;margin-bottom:0.75rem">حالة الأداء لسنة ${anneeActuelle}</p>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem">
                        ${moisStatuts.map(ms => `
                            <div style="text-align:center;padding:0.5rem;border-radius:8px;background:${ms.paye ? 'var(--primary)22' : '#e74c3c11'};border:1px solid ${ms.paye ? 'var(--primary)' : '#e74c3c'}44">
                                <p style="font-size:0.7rem;font-weight:600;color:${ms.paye ? 'var(--primary)' : '#e74c3c'}">${ms.mois.substring(0,3)}</p>
                                <i class="fas ${ms.paye ? 'fa-check-circle' : 'fa-times-circle'}" style="color:${ms.paye ? 'var(--primary)' : '#e74c3c'};font-size:1rem;margin:0.25rem 0;display:block"></i>
                                <p style="font-size:0.65rem;color:${ms.paye ? 'var(--primary)' : '#e74c3c'}">${ms.paye ? ms.montant + ' DH' : 'معلق'}</p>
                            </div>
                        `).join('')}
                        ${moisArabes.slice(moisActuelIndex + 1).map(m => `
                            <div style="text-align:center;padding:0.5rem;border-radius:8px;background:var(--surface-container-low);opacity:0.4">
                                <p style="font-size:0.7rem;font-weight:600">${m.substring(0,3)}</p>
                                <i class="fas fa-clock" style="font-size:1rem;margin:0.25rem 0;display:block"></i>
                                <p style="font-size:0.65rem">قادم</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Historique des paiements -->
                <p class="title-lg" style="font-size:0.95rem;margin-bottom:0.5rem">سجل الأداءات</p>
                ${paiementsProprietaire.length ? paiementsProprietaire.slice().reverse().map(p => `
                    <div class="item-card" style="margin-bottom:0.5rem">
                        <div class="item-visual" style="background:var(--primary-container);color:var(--primary)">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div class="item-content">
                            <p class="title-lg" style="font-size:0.9rem">واجب ${p.mois} ${p.annee}</p>
                            <p class="body-md">${p.notes || 'بدون ملاحظات'}</p>
                        </div>
                        <div class="item-value">
                            <p style="color:var(--primary);font-weight:700">${(p.montant||0).toLocaleString()} DH</p>
                            <p class="body-md" style="font-size:0.65rem">${p.date || p.dateIso}</p>
                        </div>
                    </div>
                `).join('') : this.etatVide('لا توجد أداءات مسجلة لهذا المالك', 'fa-receipt')}
            </div>`;
    },

    // ===== FORMULAIRES =====

    formulaireProprietaire() {
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">إضافة مالك جديد</h2>
                <div class="form-group mb-3">
                    <label>الاسم الكامل <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="nomProprietaire" class="form-input" placeholder="مثال: يونس الإدريسي">
                </div>
                <div class="form-group mb-3">
                    <label>رقم الهاتف</label>
                    <input type="tel" id="telProprietaire" class="form-input" placeholder="06XXXXXXXX">
                </div>
                <div class="form-group mb-3">
                    <label>رقم الشقة <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="appartProprietaire" class="form-input" placeholder="A12">
                </div>
                <div class="form-group mb-4">
                    <label>النوع</label>
                    <select id="typeProprietaire" class="form-input">
                        <option value="مالك مقيم">مالك مقيم</option>
                        <option value="مالك">مالك (غير مقيم)</option>
                        <option value="مكتري">مكتري</option>
                    </select>
                </div>
                <button class="btn-primary w-full" onclick="ControleurUI.gererSoumissionProprietaire()">تأكيد الإضافة</button>
            </div>`;
    },

    formulaireModificationProprietaire(proprietaire) {
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">تعديل معلومات المالك</h2>
                <input type="hidden" id="idProprietaireModif" value="${proprietaire.id}">
                <div class="form-group mb-3">
                    <label>الاسم الكامل <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="nomProprietaireModif" class="form-input" value="${proprietaire.nom}">
                </div>
                <div class="form-group mb-3">
                    <label>رقم الهاتف</label>
                    <input type="tel" id="telProprietaireModif" class="form-input" value="${proprietaire.telephone || ''}">
                </div>
                <div class="form-group mb-3">
                    <label>رقم الشقة <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="appartProprietaireModif" class="form-input" value="${proprietaire.appartement}">
                </div>
                <div class="form-group mb-4">
                    <label>النوع</label>
                    <select id="typeProprietaireModif" class="form-input">
                        <option value="مالك مقيم" ${proprietaire.type === 'مالك مقيم' ? 'selected' : ''}>مالك مقيم</option>
                        <option value="مالك" ${proprietaire.type === 'مالك' ? 'selected' : ''}>مالك (غير مقيم)</option>
                        <option value="مكتري" ${proprietaire.type === 'مكتري' ? 'selected' : ''}>مكتري</option>
                    </select>
                </div>
                <button class="btn-primary w-full" onclick="ControleurUI.gererModificationProprietaire()">💾 حفظ التعديلات</button>
            </div>`;
    },

    formulairePaiement(idProprietairePreselect = null) {
        const optionsProprietaire = DonneesApp.proprietaires.map(o =>
            `<option value="${o.id}" ${idProprietairePreselect === o.id ? 'selected' : ''}>${o.nom} (شقة ${o.appartement})</option>`
        ).join('');
        const mois = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
        const moisActuel = mois[new Date().getMonth()];
        const anneeActuelle = new Date().getFullYear();
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">تسجيل أداء جديد</h2>
                <div class="form-group mb-3">
                    <label>المالك <span style="color:#e74c3c">*</span></label>
                    <select id="payIdProprietaire" class="form-input">${optionsProprietaire}</select>
                </div>
                <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">
                    <div class="form-group" style="flex:1">
                        <label>المبلغ (DH) <span style="color:#e74c3c">*</span></label>
                        <input type="number" id="payMontant" class="form-input" value="350" min="1">
                    </div>
                    <div class="form-group" style="flex:1">
                        <label>الشهر</label>
                        <select id="payMois" class="form-input">
                            ${mois.map(m => `<option value="${m}" ${m === moisActuel ? 'selected' : ''}>${m}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label>السنة</label>
                    <input type="number" id="payAnnee" class="form-input" value="${anneeActuelle}">
                </div>
                <div class="form-group mb-4">
                    <label>ملاحظات</label>
                    <textarea id="payNotes" class="form-input" rows="2" placeholder="مثال: دفع نقدي"></textarea>
                </div>
                <button type="button" class="btn-primary w-full" onclick="ControleurUI.gererSoumissionPaiement()">تأكيد الأداء ✓</button>
            </div>`;
    },

    formulaireDepense() {
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">إضافة مصاريف</h2>
                <div class="form-group mb-3">
                    <label>عنوان المصروف <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="titreDepense" class="form-input" placeholder="مثال: فاتورة صوناسيد">
                </div>
                <div class="form-group mb-3">
                    <label>الفئة</label>
                    <select id="catDepense" class="form-input">
                        <option value="صيانة">🔧 صيانة</option>
                        <option value="مرافق">⚡ مرافق (ماء/كهرباء)</option>
                        <option value="نظافة">🧹 نظافة</option>
                        <option value="أخرى">📄 أخرى</option>
                    </select>
                </div>
                <div class="form-group mb-4">
                    <label>المبلغ (DH) <span style="color:#e74c3c">*</span></label>
                    <input type="number" id="montantDepense" class="form-input" placeholder="0" min="1">
                </div>
                <button class="btn-primary w-full" onclick="ControleurUI.gererSoumissionDepense()">تسجيل المصروف</button>
            </div>`;
    },

    formulaireProjet() {
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">مشروع جديد</h2>
                <div class="form-group mb-3">
                    <label>اسم المشروع <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="titreProjet" class="form-input" placeholder="مثال: صباغة العمارة">
                </div>
                <div class="form-group mb-3">
                    <label>الميزانية التقديرية (DH) <span style="color:#e74c3c">*</span></label>
                    <input type="number" id="budgetProjet" class="form-input" min="1">
                </div>
                <div class="form-group mb-3">
                    <label>المساهمة لكل شقة (DH)</label>
                    <input type="number" id="partProjet" class="form-input" min="0">
                </div>
                <div class="form-group mb-4">
                    <label>وصف المشروع</label>
                    <textarea id="descProjet" class="form-input" rows="3" placeholder="تفاصيل العمل المطلوب..."></textarea>
                </div>
                <button class="btn-primary w-full" onclick="ControleurUI.gererSoumissionProjet()">بدء المشروع</button>
            </div>`;
    },

    formulaireAnnonce() {
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">إعلان جديد</h2>
                <div class="form-group mb-3">
                    <label>عنوان الإعلان <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="titreAnnonce" class="form-input" placeholder="عنوان الإعلان">
                </div>
                <div class="form-group mb-3">
                    <label>الأولوية</label>
                    <select id="prioriteAnnonce" class="form-input">
                        <option value="medium">⚪ عادي</option>
                        <option value="high">🔴 مهم جداً</option>
                    </select>
                </div>
                <div class="form-group mb-4">
                    <label>المحتوى <span style="color:#e74c3c">*</span></label>
                    <textarea id="contenuAnnonce" class="form-input" rows="4" placeholder="اكتب رسالة الإعلان هنا..."></textarea>
                </div>
                <button class="btn-primary w-full" onclick="ControleurUI.gererSoumissionAnnonce()">نشر الإعلان</button>
            </div>`;
    },

    formulaireFonds() {
        return `
            <div class="p-4">
                <h2 class="headline-sm mb-4">عملية في الصندوق</h2>
                <div class="form-group mb-3">
                    <label>نوع العملية</label>
                    <div style="display:flex;gap:0.75rem;padding:0.75rem;background:var(--surface-container-low);border-radius:12px;margin-top:0.5rem">
                        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;flex:1;padding:0.5rem;border-radius:8px;background:var(--primary)22;color:var(--primary)">
                            <input type="radio" name="typeFonds" value="deposit" checked> 💰 إيداع
                        </label>
                        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;flex:1;padding:0.5rem;border-radius:8px">
                            <input type="radio" name="typeFonds" value="withdrawal"> 📤 سحب
                        </label>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label>المبلغ (DH) <span style="color:#e74c3c">*</span></label>
                    <input type="number" id="montantFonds" class="form-input" placeholder="0" min="1">
                </div>
                <div class="form-group mb-4">
                    <label>البيان / الوصف <span style="color:#e74c3c">*</span></label>
                    <input type="text" id="descFonds" class="form-input" placeholder="مثال: رصيد افتتاحي">
                </div>
                <button class="btn-primary w-full" onclick="ControleurUI.gererSoumissionFonds()">تأكيد العملية ✓</button>
            </div>`;
    }
};
