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
        const solde = SelecteursDonnees.obtenirSolde();
        const totalCollectes = SelecteursDonnees.obtenirTotalCollectes(filtre);
        const totalDepenses = SelecteursDonnees.obtenirTotalDepenses(filtre);
        const donneesRetards = SelecteursDonnees.obtenirDetailImpayes();

        conteneur.innerHTML = `
            ${ComposantsUI.controleFiltreSegmente(filtre)}

            <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem">
                ${ComposantsUI.carteRapport("الرصيد الصافي", `${solde.toLocaleString()} DH`, "الوضعية الإجمالية للصندوق", "fa-vault")}
                ${ComposantsUI.carteRapport("المداخيل", `${totalCollectes.toLocaleString()} DH`, "الفترة المختارة", "fa-chart-line", "#2ecc71")}
                ${ComposantsUI.carteRapport("المصاريف", `${totalDepenses.toLocaleString()} DH`, "الفترة المختارة", "fa-file-invoice-dollar", "#e74c3c")}
            </div>

            <div class="mb-4">
                ${ComposantsUI.carteRetards(donneesRetards)}
            </div>

            <p class="title-lg mb-3" style="font-size:0.95rem">ملخص المشاريع</p>
            ${DonneesApp.projets.map(p => `
                <div class="card mb-3">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <p class="title-lg" style="font-size:0.95rem">${p.titre}</p>
                        <span class="badge ${p.progression >= 100 ? 'badge-paid' : 'badge-pending'}">${p.progression}%</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-top:0.5rem">
                        <span class="body-md">الميزانية: ${(p.budget||0).toLocaleString()} DH</span>
                        <span class="body-md" style="color:var(--primary)">المحصل: ${(p.collecte||0).toLocaleString()} DH</span>
                    </div>
                </div>
            `).join('')}

            <div style="display:flex;gap:0.75rem;margin-top:1rem">
                <button class="btn-primary" style="flex:1" onclick="window.ControleurUI.ouvrirWhatsApp('', 'monthly_report')">
                    <i class="fab fa-whatsapp" style="margin-left:0.5rem"></i> تقرير WhatsApp
                </button>
                <button class="card" style="margin-bottom:0;padding:1rem;width:auto;cursor:pointer" onclick="alert('تصدير PDF قيد التطوير')">
                    <i class="fas fa-file-pdf" style="color:#e74c3c"></i>
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
