/**
 * src/screens/renderers.js
 * Logique pour peupler les écrans spécifiques.
 */

window.Ecrans = {

    tableauDeBord() {
        const solde = SelecteursDonnees.obtenirSolde();
        const depenses = SelecteursDonnees.obtenirDepensesMensuelles();
        const nbProprietaires = DonneesApp.proprietaires.length;
        const donneesRetards = SelecteursDonnees.obtenirDetailImpayes();

        // Mise à jour des compteurs de l'en-tête
        const elBalance = document.getElementById('dashBalance');
        const elOwners = document.getElementById('dashOwners');
        const elExpenses = document.getElementById('dashExpenses');
        const elUnpaid = document.getElementById('dashUnpaid');

        if (elBalance) elBalance.textContent = `${solde.toLocaleString()} DH`;
        if (elOwners) elOwners.textContent = nbProprietaires;
        if (elExpenses) elExpenses.textContent = `${depenses.toLocaleString()} DH`;
        if (elUnpaid) elUnpaid.textContent = donneesRetards.nb;

        const listeRecente = SelecteursDonnees.obtenirActiviteRecente();
        const conteneur = document.getElementById('recentActivity');
        if (!conteneur) return;

        if (listeRecente.length === 0) {
            conteneur.innerHTML = ComposantsUI.etatVide("لا توجد عمليات أخيرة");
            return;
        }

        conteneur.innerHTML = listeRecente.map(act => `
            <div class="item-card">
                <div class="item-visual" style="background: ${act.couleur}22; color: ${act.couleur}">
                    <i class="fas ${act.icone}"></i>
                </div>
                <div class="item-content">
                    <p class="title-lg" style="font-size: 0.9rem">${act.titre}</p>
                    <p class="body-md">${act.date}</p>
                </div>
                <div class="item-value">
                    <p style="color: ${act.type === 'payment' ? 'var(--primary)' : '#e74c3c'}; font-weight: 700">
                        ${act.type === 'payment' ? '+' : '-'}${(act.montant||0).toLocaleString()} DH
                    </p>
                </div>
            </div>
        `).join('');
    },

    proprietaires() {
        const conteneur = document.getElementById('ownersContent');
        if (!conteneur) return;
        conteneur.innerHTML = DonneesApp.proprietaires.length
            ? DonneesApp.proprietaires.map(o => ComposantsUI.carteProprietaire(o)).join('')
            : ComposantsUI.etatVide("لا يوجد ملاك مسجلين");
    },

    depenses() {
        const conteneur = document.getElementById('expensesContent');
        if (!conteneur) return;

        const total = DonneesApp.depenses.reduce((s, e) => s + (e.montant || 0), 0);
        const resumer = `
            <div class="card bento-hero mb-3" style="text-align:center;padding:1rem">
                <p class="body-md">إجمالي المصاريف</p>
                <h2 class="headline-lg" style="color:#e74c3c">${total.toLocaleString()} DH</h2>
            </div>`;

        conteneur.innerHTML = resumer + (DonneesApp.depenses.length
            ? DonneesApp.depenses.slice().reverse().map(e => ComposantsUI.carteDepense(e)).join('')
            : ComposantsUI.etatVide("لا توجد مصاريف مسجلة", "fa-file-invoice-dollar"));
    },

    paiements() {
        const conteneur = document.getElementById('paymentsContent');
        if (!conteneur) return;

        const total = DonneesApp.paiements.reduce((s, p) => s + (p.montant || 0), 0);
        const resumer = `
            <div class="card bento-hero mb-3" style="text-align:center;padding:1rem">
                <p class="body-md">إجمالي الأداءات المحصلة</p>
                <h2 class="headline-lg" style="color:var(--primary)">${total.toLocaleString()} DH</h2>
            </div>`;

        conteneur.innerHTML = resumer + (DonneesApp.paiements.length
            ? DonneesApp.paiements.slice().reverse().map(p => ComposantsUI.cartePaiement(p)).join('')
            : ComposantsUI.etatVide("لا توجد أداءات مسجلة", "fa-calendar-check"));
    },

    projets() {
        const conteneur = document.getElementById('projectsContent');
        if (!conteneur) return;
        conteneur.innerHTML = DonneesApp.projets.length
            ? DonneesApp.projets.map(p => ComposantsUI.carteProjet(p)).join('')
            : ComposantsUI.etatVide("لا توجد مشاريع حالية", "fa-tools");
    },

    annonces() {
        const conteneur = document.getElementById('announcementsContent');
        if (!conteneur) return;
        conteneur.innerHTML = DonneesApp.annonces.length
            ? DonneesApp.annonces.slice().reverse().map(a => ComposantsUI.carteAnnonce(a)).join('')
            : ComposantsUI.etatVide("لا توجد إعلانات", "fa-bullhorn");
    },

    fonds() {
        const conteneur = document.getElementById('fundContent');
        if (!conteneur) return;
        const solde = SelecteursDonnees.obtenirSoldeFonds();
        const totalDepots = DonneesApp.transactionsFonds.filter(t => t.type === 'deposit' && t.statut === 'completed').reduce((s, t) => s + t.montant, 0);
        const totalRetraits = DonneesApp.transactionsFonds.filter(t => t.type === 'withdrawal' && t.statut === 'completed').reduce((s, t) => s + t.montant, 0);

        conteneur.innerHTML = `
            <div class="card bento-hero mb-3" style="text-align:center;padding:1.5rem">
                <p class="body-md">الرصيد الحالي للصندوق</p>
                <h2 class="headline-lg" style="color:var(--primary)">${solde.toLocaleString()} DH</h2>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-top:1rem">
                    <div style="background:var(--primary)11;border-radius:10px;padding:0.6rem">
                        <p class="body-md" style="font-size:0.75rem">إجمالي الإيداعات</p>
                        <p style="color:var(--primary);font-weight:700">+${totalDepots.toLocaleString()} DH</p>
                    </div>
                    <div style="background:#e74c3c11;border-radius:10px;padding:0.6rem">
                        <p class="body-md" style="font-size:0.75rem">إجمالي السحوبات</p>
                        <p style="color:#e74c3c;font-weight:700">-${totalRetraits.toLocaleString()} DH</p>
                    </div>
                </div>
            </div>
            <p class="title-lg mb-3" style="font-size:0.95rem">سجل العمليات</p>
            <div>
                ${DonneesApp.transactionsFonds.length === 0
                    ? ComposantsUI.etatVide("لا توجد عمليات")
                    : DonneesApp.transactionsFonds.slice().reverse().map(t => `
                        <div class="item-card" style="margin-bottom:0.5rem">
                            <div class="item-visual" style="background:${t.type === 'deposit' ? 'var(--primary)' : '#e74c3c'}22;color:${t.type === 'deposit' ? 'var(--primary)' : '#e74c3c'}">
                                <i class="fas ${t.type === 'deposit' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                            </div>
                            <div class="item-content">
                                <p class="title-lg" style="font-size:0.9rem">${t.description}</p>
                                <p class="body-md">${t.date || t.dateIso}</p>
                            </div>
                            <div class="item-value">
                                <p style="color:${t.type === 'deposit' ? 'var(--primary)' : '#e74c3c'};font-weight:700">
                                    ${t.type === 'deposit' ? '+' : '-'}${(t.montant||0).toLocaleString()} DH
                                </p>
                            </div>
                        </div>
                    `).join('')}
            </div>`;
    },

    rapports(filtre = 'all') {
        const conteneur = document.getElementById('reportsContent');
        if (!conteneur) return;

        const moisArabes = ["يناير","فبراير","مارس","أبريل","ماي","يونيو","يوليوز","غشت","شتنبر","أكتوبر","نونبر","دجنبر"];
        const anneeActuelle = new Date().getFullYear().toString();
        const moisActuelIndex = new Date().getMonth();

        // ===== Calculs selon filtre =====
        let paiementsFiltres = DonneesApp.paiements;
        let depensesFiltrees = DonneesApp.depenses;
        let titreFiltre = 'الكل';

        if (filtre === 'month') {
            const moisActuel = moisArabes[moisActuelIndex];
            paiementsFiltres = DonneesApp.paiements.filter(p => p.mois === moisActuel && p.annee === anneeActuelle);
            depensesFiltrees = DonneesApp.depenses.filter(d => {
                const d2 = new Date(d.dateIso || d.date);
                return d2.getMonth() === moisActuelIndex && d2.getFullYear().toString() === anneeActuelle;
            });
            titreFiltre = `${moisActuel} ${anneeActuelle}`;
        } else if (filtre === 'year') {
            paiementsFiltres = DonneesApp.paiements.filter(p => p.annee === anneeActuelle);
            depensesFiltrees = DonneesApp.depenses.filter(d => {
                const d2 = new Date(d.dateIso || d.date);
                return d2.getFullYear().toString() === anneeActuelle;
            });
            titreFiltre = `سنة ${anneeActuelle}`;
        }

        const totalMداخيل = paiementsFiltres.reduce((s, p) => s + (p.montant || 0), 0);
        const totalمصاريف = depensesFiltrees.reduce((s, d) => s + (d.montant || 0), 0);
        const صافيRésultat = totalMداخيل - totalمصاريف;
        const soldeTotal = SelecteursDonnees.obtenirSolde();

        // ===== معدل التحصيل =====
        const nbProprietaires = DonneesApp.proprietaires.length;
        let nbPayesMois = 0;
        if (filtre === 'month') {
            const moisActuel = moisArabes[moisActuelIndex];
            nbPayesMois = paiementsFiltres.map(p => p.idProprietaire).filter((v,i,a) => a.indexOf(v) === i).length;
        } else if (filtre === 'year') {
            nbPayesMois = DonneesApp.proprietaires.filter(o =>
                DonneesApp.paiements.some(p => p.idProprietaire === o.id && p.annee === anneeActuelle)
            ).length;
        } else {
            nbPayesMois = DonneesApp.proprietaires.filter(o =>
                DonneesApp.paiements.some(p => p.idProprietaire === o.id)
            ).length;
        }
        const tاuxCollecte = nbProprietaires > 0 ? Math.round((nbPayesMois / nbProprietaires) * 100) : 0;

        // ===== بيانات المخطط الشهري (12 شهر) =====
        const donnéesGraphe = moisArabes.slice(0, moisActuelIndex + 1).map((mois, i) => {
            const entrees = DonneesApp.paiements
                .filter(p => p.mois === mois && p.annee === anneeActuelle)
                .reduce((s, p) => s + (p.montant || 0), 0);
            const sorties = DonneesApp.depenses.filter(d => {
                const dd = new Date(d.dateIso || d.date);
                return dd.getMonth() === i && dd.getFullYear().toString() === anneeActuelle;
            }).reduce((s, d) => s + (d.montant || 0), 0);
            return { mois: mois.substring(0, 3), entrees, sorties };
        });
        const maxValeur = Math.max(...donnéesGraphe.map(d => Math.max(d.entrees, d.sorties)), 1);

        // ===== تصنيف المصاريف =====
        const catégories = {};
        depensesFiltrees.forEach(d => {
            const cat = d.categorie || 'أخرى';
            catégories[cat] = (catégories[cat] || 0) + (d.montant || 0);
        });
        const catTriées = Object.entries(catégories).sort((a, b) => b[1] - a[1]);

        // ===== حالة الملاك =====
        const étatsProprietaires = DonneesApp.proprietaires.map(o => {
            let nbPayé = 0;
            if (filtre === 'month') {
                const moisActuel = moisArabes[moisActuelIndex];
                nbPayé = paiementsFiltres.filter(p => p.idProprietaire === o.id).length;
            } else if (filtre === 'year') {
                nbPayé = paiementsFiltres.filter(p => p.idProprietaire === o.id).length;
            } else {
                nbPayé = DonneesApp.paiements.filter(p => p.idProprietaire === o.id).length;
            }
            const montantPayé = paiementsFiltres.filter(p => p.idProprietaire === o.id).reduce((s,p) => s+(p.montant||0), 0);
            return { ...o, nbPayé, montantPayé, payé: nbPayé > 0 };
        }).sort((a, b) => a.payé - b.payé);

        conteneur.innerHTML = `
            ${ComposantsUI.controleFiltreSegmente(filtre)}

            <!-- بطاقات ملخص -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">
                <div class="card" style="padding:1rem;text-align:center;grid-column:1/-1;background:linear-gradient(135deg,var(--primary),#1a4fcc)">
                    <p style="color:rgba(255,255,255,0.8);font-size:0.8rem">الرصيد الإجمالي للصندوق</p>
                    <p style="color:white;font-size:1.8rem;font-weight:800">${soldeTotal.toLocaleString()} DH</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center">
                    <i class="fas fa-arrow-down" style="color:#2ecc71;font-size:1.2rem"></i>
                    <p style="font-size:0.75rem;margin-top:0.25rem">المداخيل</p>
                    <p style="color:#2ecc71;font-weight:700;font-size:1.1rem">+${totalMداخيل.toLocaleString()} DH</p>
                    <p style="font-size:0.65rem;opacity:0.6">${titreFiltre}</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center">
                    <i class="fas fa-arrow-up" style="color:#e74c3c;font-size:1.2rem"></i>
                    <p style="font-size:0.75rem;margin-top:0.25rem">المصاريف</p>
                    <p style="color:#e74c3c;font-weight:700;font-size:1.1rem">-${totalمصاريف.toLocaleString()} DH</p>
                    <p style="font-size:0.65rem;opacity:0.6">${titreFiltre}</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center">
                    <i class="fas fa-scale-balanced" style="color:${صافيRésultat >= 0 ? '#2ecc71' : '#e74c3c'};font-size:1.2rem"></i>
                    <p style="font-size:0.75rem;margin-top:0.25rem">الصافي</p>
                    <p style="color:${صافيRésultat >= 0 ? '#2ecc71' : '#e74c3c'};font-weight:700;font-size:1.1rem">${صافيRésultat >= 0 ? '+' : ''}${صافيRésultat.toLocaleString()} DH</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center">
                    <i class="fas fa-percent" style="color:var(--primary);font-size:1.2rem"></i>
                    <p style="font-size:0.75rem;margin-top:0.25rem">معدل التحصيل</p>
                    <p style="color:var(--primary);font-weight:700;font-size:1.1rem">${tاuxCollecte}%</p>
                    <p style="font-size:0.65rem;opacity:0.6">${nbPayesMois} / ${nbProprietaires} مالك</p>
                </div>
            </div>

            <!-- المخطط الشهري -->
            ${donnéesGraphe.length > 0 ? `
            <div class="card" style="margin-bottom:1rem">
                <p class="title-lg" style="font-size:0.9rem;margin-bottom:0.75rem">📊 المداخيل مقابل المصاريف ${anneeActuelle}</p>
                <div style="display:flex;align-items:flex-end;gap:4px;height:80px;border-bottom:2px solid var(--outline-variant)">
                    ${donnéesGraphe.map(d => `
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
                            <div style="display:flex;gap:2px;align-items:flex-end;height:70px">
                                <div style="width:8px;background:#2ecc71;border-radius:2px 2px 0 0;height:${Math.round((d.entrees/maxValeur)*68)+2}px;min-height:2px"></div>
                                <div style="width:8px;background:#e74c3c;border-radius:2px 2px 0 0;height:${Math.round((d.sorties/maxValeur)*68)+2}px;min-height:2px"></div>
                            </div>
                            <p style="font-size:0.55rem;text-align:center">${d.mois}</p>
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex;gap:1rem;margin-top:0.5rem;justify-content:center">
                    <div style="display:flex;align-items:center;gap:0.25rem"><div style="width:10px;height:10px;background:#2ecc71;border-radius:2px"></div><p style="font-size:0.7rem">مداخيل</p></div>
                    <div style="display:flex;align-items:center;gap:0.25rem"><div style="width:10px;height:10px;background:#e74c3c;border-radius:2px"></div><p style="font-size:0.7rem">مصاريف</p></div>
                </div>
            </div>` : ''}

            <!-- المتأخرات -->
            <div class="mb-3">
                ${ComposantsUI.carteRetards(SelecteursDonnees.obtenirDetailImpayes())}
            </div>

            <!-- حالة الملاك -->
            <div class="card" style="margin-bottom:1rem">
                <p class="title-lg" style="font-size:0.9rem;margin-bottom:0.75rem">👥 وضعية الملاك — ${titreFiltre}</p>
                ${étatsProprietaires.map(o => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0;border-bottom:1px solid var(--outline-variant)">
                        <div style="display:flex;align-items:center;gap:0.6rem">
                            <div style="width:32px;height:32px;border-radius:50%;background:${o.payé ? '#2ecc7122' : '#e74c3c22'};color:${o.payé ? '#2ecc71' : '#e74c3c'};display:flex;align-items:center;justify-content:center;font-size:0.9rem">
                                <i class="fas ${o.payé ? 'fa-check' : 'fa-times'}"></i>
                            </div>
                            <div>
                                <p style="font-size:0.85rem;font-weight:600">${o.nom}</p>
                                <p style="font-size:0.7rem;opacity:0.6">شقة ${o.appartement}</p>
                            </div>
                        </div>
                        <div style="text-align:left">
                            ${o.payé
                                ? `<p style="color:#2ecc71;font-weight:700;font-size:0.85rem">+${o.montantPayé.toLocaleString()} DH</p>`
                                : `<span class="badge badge-pending" style="font-size:0.65rem">متأخر</span>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- تصنيف المصاريف -->
            ${catTriées.length > 0 ? `
            <div class="card" style="margin-bottom:1rem">
                <p class="title-lg" style="font-size:0.9rem;margin-bottom:0.75rem">📂 المصاريف حسب الفئة — ${titreFiltre}</p>
                ${catTriées.map(([cat, montant]) => {
                    const pct = totalمصاريف > 0 ? Math.round((montant / totalمصاريف) * 100) : 0;
                    return `
                    <div style="margin-bottom:0.75rem">
                        <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                            <p style="font-size:0.8rem;font-weight:600">${cat}</p>
                            <p style="font-size:0.8rem;color:#e74c3c">${montant.toLocaleString()} DH (${pct}%)</p>
                        </div>
                        <div style="height:6px;background:var(--outline-variant);border-radius:3px">
                            <div style="height:6px;background:#e74c3c;border-radius:3px;width:${pct}%;transition:width 0.5s"></div>
                        </div>
                    </div>`;
                }).join('')}
            </div>` : ''}

            <!-- المشاريع -->
            ${DonneesApp.projets.length > 0 ? `
            <div class="card" style="margin-bottom:1rem">
                <p class="title-lg" style="font-size:0.9rem;margin-bottom:0.75rem">🔧 المشاريع الجارية</p>
                ${DonneesApp.projets.map(p => {
                    const pct = Math.min(100, Math.round(((p.collecte||0) / (p.budget||1)) * 100));
                    return `
                    <div style="margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid var(--outline-variant)">
                        <div style="display:flex;justify-content:space-between">
                            <p style="font-size:0.85rem;font-weight:600">${p.titre}</p>
                            <span class="badge ${pct >= 100 ? 'badge-paid' : 'badge-pending'}">${pct}%</span>
                        </div>
                        <div style="height:6px;background:var(--outline-variant);border-radius:3px;margin:0.4rem 0">
                            <div style="height:6px;background:var(--primary);border-radius:3px;width:${pct}%"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between">
                            <p style="font-size:0.7rem;opacity:0.7">الميزانية: ${(p.budget||0).toLocaleString()} DH</p>
                            <p style="font-size:0.7rem;color:var(--primary)">المحصل: ${(p.collecte||0).toLocaleString()} DH</p>
                        </div>
                    </div>`;
                }).join('')}
            </div>` : ''}

            <!-- أزرار التصدير -->
            <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
                <button class="btn-primary" style="flex:1" onclick="window.ControleurUI.envoyerRapportWhatsApp('${filtre}')">
                    <i class="fab fa-whatsapp" style="margin-left:0.5rem"></i> تقرير WhatsApp
                </button>
                <button style="background:var(--surface-container);border:1px solid var(--outline);border-radius:12px;padding:1rem;cursor:pointer" onclick="window.print()">
                    <i class="fas fa-print" style="color:var(--primary)"></i>
                </button>
            </div>`;
    },

    receipts() {
        const conteneur = document.getElementById('receiptsContent');
        if (!conteneur) return;
        const paiements = DonneesApp.paiements;

        if (paiements.length === 0) {
            conteneur.innerHTML = ComposantsUI.etatVide("لا توجد وصولات حالياً\nسجّل أداءً أولاً من قسم الأداءات", "fa-receipt");
            return;
        }

        conteneur.innerHTML = `
            <p class="body-md" style="margin-bottom:0.75rem;opacity:0.7">اضغط على الوصل لعرض التفاصيل</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
                ${paiements.slice().reverse().map(p => {
                    const nomProp = SelecteursDonnees.obtenirNomProprietaire(p.idProprietaire);
                    const prop = DonneesApp.proprietaires.find(o => o.id === p.idProprietaire);
                    return `
                        <div class="card" style="padding:0.75rem;text-align:center;cursor:pointer"
                             onclick="ControleurUI.afficherDetailRecu(${p.id})">
                            <div style="aspect-ratio:1;background:var(--primary)11;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:0.5rem">
                                <i class="fas fa-file-invoice" style="font-size:2rem;color:var(--primary)"></i>
                            </div>
                            <p style="font-weight:700;font-size:0.85rem">${nomProp}</p>
                            <p class="body-md" style="font-size:0.7rem">${p.mois} ${p.annee}</p>
                            <p style="color:var(--primary);font-weight:700;font-size:0.85rem">${(p.montant||0).toLocaleString()} DH</p>
                            <div style="display:flex;gap:0.25rem;justify-content:center;margin-top:0.5rem">
                                <button onclick="event.stopPropagation();ControleurUI.ouvrirWhatsApp('${prop ? prop.telephone : ''}', 'receipt_${p.id}')"
                                        style="background:#25D36622;color:#25D366;border:none;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.7rem;cursor:pointer">
                                    <i class="fab fa-whatsapp"></i>
                                </button>
                                <button onclick="event.stopPropagation();ControleurUI.imprimerRecu(${p.id})"
                                        style="background:var(--primary)22;color:var(--primary);border:none;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.7rem;cursor:pointer">
                                    <i class="fas fa-print"></i>
                                </button>
                            </div>
                        </div>`;
                }).join('')}
            </div>`;
    },

    profilProprietaire(idProprietaire) {
        const conteneur = document.getElementById('ownerProfileContent');
        if (!conteneur) return;
        const proprietaire = DonneesApp.proprietaires.find(o => o.id === idProprietaire);
        if (!proprietaire) {
            conteneur.innerHTML = ComposantsUI.etatVide("المالك غير موجود");
            return;
        }
        conteneur.innerHTML = ComposantsUI.pageProfilProprietaire(proprietaire);
    }
};
