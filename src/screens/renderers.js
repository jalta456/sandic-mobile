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

        const MOIS = ["يناير","فبراير","مارس","أبريل","ماي","يونيو","يوليوز","غشت","شتنبر","أكتوبر","نونبر","دجنبر"];
        const MOIS_COURT = ["يناير","فبراير","مارس","أبريل","ماي","يونيو","يوليوز","غشت","شتنبر","أكتوبر","نونبر","دجنبر"].map(m=>m.substring(0,3));
        const annee = new Date().getFullYear().toString();
        const moisIdx = new Date().getMonth();

        // ---- Filtrage ----
        let payFilt = [...DonneesApp.paiements];
        let depFilt = [...DonneesApp.depenses];
        let titre = 'الكل';

        if (filtre === 'month') {
            payFilt = payFilt.filter(p => p.mois === MOIS[moisIdx] && p.annee === annee);
            depFilt = depFilt.filter(d => { const dd=new Date(d.dateIso||d.date); return dd.getMonth()===moisIdx && dd.getFullYear().toString()===annee; });
            titre = `${MOIS[moisIdx]} ${annee}`;
        } else if (filtre === 'year') {
            payFilt = payFilt.filter(p => p.annee === annee);
            depFilt = depFilt.filter(d => { const dd=new Date(d.dateIso||d.date); return dd.getFullYear().toString()===annee; });
            titre = `سنة ${annee}`;
        }

        const totEntrees = payFilt.reduce((s,p)=>s+(p.montant||0),0);
        const totSorties = depFilt.reduce((s,d)=>s+(d.montant||0),0);
        const soldeNet   = totEntrees - totSorties;
        const soldeTotal = SelecteursDonnees.obtenirSolde();
        const nbProp     = DonneesApp.proprietaires.length;

        // معدل التحصيل
        const propAyantPaye = new Set(payFilt.map(p=>p.idProprietaire));
        const tauxCollecte  = nbProp>0 ? Math.round((propAyantPaye.size/nbProp)*100) : 0;

        // ---- Données graphe SVG mensuel (12 mois) ----
        const dataGraphe = MOIS.slice(0, moisIdx+1).map((mois,i) => {
            const ent = DonneesApp.paiements.filter(p=>p.mois===mois&&p.annee===annee).reduce((s,p)=>s+(p.montant||0),0);
            const sor = DonneesApp.depenses.filter(d=>{ const dd=new Date(d.dateIso||d.date); return dd.getMonth()===i&&dd.getFullYear().toString()===annee; }).reduce((s,d)=>s+(d.montant||0),0);
            return { label: MOIS_COURT[i], ent, sor };
        });
        const maxVal = Math.max(...dataGraphe.map(d=>Math.max(d.ent,d.sor)), 1);
        const svgH = 100, svgPad = 4;
        const barW = Math.max(6, Math.floor((360 - svgPad*2) / dataGraphe.length / 2) - 2);

        const svgBars = dataGraphe.map((d,i) => {
            const x = svgPad + i * ((360-svgPad*2)/dataGraphe.length);
            const hEnt = Math.max(2, Math.round((d.ent/maxVal)*(svgH-20)));
            const hSor = Math.max(2, Math.round((d.sor/maxVal)*(svgH-20)));
            return `
                <rect x="${x}" y="${svgH-16-hEnt}" width="${barW}" height="${hEnt}" fill="#2ecc71" rx="2"/>
                <rect x="${x+barW+1}" y="${svgH-16-hSor}" width="${barW}" height="${hSor}" fill="#e74c3c" rx="2"/>
                <text x="${x+barW}" y="${svgH-2}" text-anchor="middle" font-size="6" fill="currentColor" opacity="0.6">${d.label}</text>`;
        }).join('');

        // ---- Catégories dépenses pour barres horizontales ----
        const cats = {};
        depFilt.forEach(d => { const c=d.categorie||'أخرى'; cats[c]=(cats[c]||0)+(d.montant||0); });
        const catsArr = Object.entries(cats).sort((a,b)=>b[1]-a[1]);

        // ---- Tableau annuel détaillé (Propriétaires × Mois) ----
        const moisTableau = filtre==='year' ? MOIS.slice(0,moisIdx+1) : (filtre==='month' ? [MOIS[moisIdx]] : MOIS.slice(0,moisIdx+1));
        const tableauProp = DonneesApp.proprietaires.map(o => {
            const parMois = moisTableau.map(mois => {
                const pay = (filtre==='year'||filtre==='all')
                    ? DonneesApp.paiements.filter(p=>p.idProprietaire===o.id && p.mois===mois && p.annee===annee)
                    : payFilt.filter(p=>p.idProprietaire===o.id && p.mois===mois);
                return { payé: pay.length>0, montant: pay.reduce((s,p)=>s+(p.montant||0),0) };
            });
            const totalPaye = parMois.reduce((s,m)=>s+m.montant,0);
            const nbPayé = parMois.filter(m=>m.payé).length;
            return { ...o, parMois, totalPaye, nbPayé };
        });

        conteneur.innerHTML = `
            ${ComposantsUI.controleFiltreSegmente(filtre)}

            <!-- ===== بطاقات ملخص ===== -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:1rem">
                <div style="grid-column:1/-1;background:linear-gradient(135deg,#1d4ed8,#7c3aed);border-radius:16px;padding:1.2rem;text-align:center;color:white">
                    <p style="font-size:0.75rem;opacity:0.85;margin-bottom:0.25rem">الرصيد الإجمالي للصندوق</p>
                    <p style="font-size:2rem;font-weight:800;letter-spacing:-1px">${soldeTotal.toLocaleString()} DH</p>
                    <p style="font-size:0.7rem;opacity:0.7;margin-top:0.25rem">آخر تحديث: ${new Date().toLocaleDateString('ar-MA')}</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center;border-right:3px solid #2ecc71">
                    <i class="fas fa-arrow-circle-down" style="color:#2ecc71;font-size:1.3rem"></i>
                    <p style="font-size:0.7rem;margin:0.2rem 0">المداخيل</p>
                    <p style="color:#2ecc71;font-weight:800;font-size:1rem">+${totEntrees.toLocaleString()} DH</p>
                    <p style="font-size:0.6rem;opacity:0.6">${titre}</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center;border-right:3px solid #e74c3c">
                    <i class="fas fa-arrow-circle-up" style="color:#e74c3c;font-size:1.3rem"></i>
                    <p style="font-size:0.7rem;margin:0.2rem 0">المصاريف</p>
                    <p style="color:#e74c3c;font-weight:800;font-size:1rem">-${totSorties.toLocaleString()} DH</p>
                    <p style="font-size:0.6rem;opacity:0.6">${titre}</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center;border-right:3px solid ${soldeNet>=0?'#2ecc71':'#e74c3c'}">
                    <i class="fas fa-balance-scale" style="color:${soldeNet>=0?'#2ecc71':'#e74c3c'};font-size:1.3rem"></i>
                    <p style="font-size:0.7rem;margin:0.2rem 0">الصافي</p>
                    <p style="color:${soldeNet>=0?'#2ecc71':'#e74c3c'};font-weight:800;font-size:1rem">${soldeNet>=0?'+':''}${soldeNet.toLocaleString()} DH</p>
                </div>
                <div class="card" style="padding:0.85rem;text-align:center;border-right:3px solid var(--primary)">
                    <div style="position:relative;display:inline-block;width:44px;height:44px;margin-bottom:0.2rem">
                        <svg width="44" height="44" style="transform:rotate(-90deg)">
                            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--outline-variant)" stroke-width="4"/>
                            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--primary)" stroke-width="4"
                                stroke-dasharray="${(tauxCollecte/100)*113} 113"/>
                        </svg>
                        <p style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:0.65rem;font-weight:700;color:var(--primary)">${tauxCollecte}%</p>
                    </div>
                    <p style="font-size:0.7rem">معدل التحصيل</p>
                    <p style="font-size:0.6rem;opacity:0.6">${propAyantPaye.size}/${nbProp} مالك</p>
                </div>
            </div>

            <!-- ===== مخطط SVG ===== -->
            <div class="card" style="margin-bottom:1rem;padding:1rem" id="grapheSection">
                <p style="font-size:0.9rem;font-weight:700;margin-bottom:0.75rem">📊 المداخيل مقابل المصاريف — ${annee}</p>
                <svg width="100%" viewBox="0 0 360 ${svgH}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
                    ${svgBars}
                    <line x1="${svgPad}" y1="${svgH-16}" x2="${360-svgPad}" y2="${svgH-16}" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/>
                </svg>
                <div style="display:flex;gap:1.2rem;margin-top:0.5rem;justify-content:center">
                    <div style="display:flex;align-items:center;gap:0.3rem"><div style="width:12px;height:8px;background:#2ecc71;border-radius:2px"></div><span style="font-size:0.7rem">مداخيل</span></div>
                    <div style="display:flex;align-items:center;gap:0.3rem"><div style="width:12px;height:8px;background:#e74c3c;border-radius:2px"></div><span style="font-size:0.7rem">مصاريف</span></div>
                </div>
            </div>

            <!-- ===== جدول سنوي مفصل ===== -->
            <div class="card" style="margin-bottom:1rem;padding:1rem;overflow-x:auto" id="tableauAnnuel">
                <p style="font-size:0.9rem;font-weight:700;margin-bottom:0.75rem">📋 جدول الأداءات التفصيلي — ${titre}</p>
                <div style="overflow-x:auto;-webkit-overflow-scrolling:touch">
                <table style="width:100%;border-collapse:collapse;font-size:0.72rem;min-width:${50+moisTableau.length*55}px">
                    <thead>
                        <tr style="background:var(--primary);color:white">
                            <th style="padding:0.5rem 0.4rem;text-align:right;border-radius:8px 0 0 8px;position:sticky;right:0;background:var(--primary)">المالك / الشقة</th>
                            ${moisTableau.map(m=>`<th style="padding:0.5rem 0.3rem;text-align:center;min-width:52px">${m.substring(0,3)}</th>`).join('')}
                            <th style="padding:0.5rem 0.4rem;text-align:center;border-radius:0 8px 8px 0">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableauProp.map((o,ri) => `
                        <tr style="background:${ri%2===0?'var(--surface-container)':'transparent'}">
                            <td style="padding:0.5rem 0.4rem;font-weight:600;position:sticky;right:0;background:${ri%2===0?'var(--surface-container)':'var(--surface)'};border-radius:6px;white-space:nowrap">
                                ${o.nom.split(' ')[0]}<br><span style="color:var(--on-surface-variant);font-size:0.65rem;font-weight:400">ش.${o.appartement}</span>
                            </td>
                            ${o.parMois.map(m=>`
                            <td style="padding:0.4rem 0.2rem;text-align:center">
                                ${m.payé
                                    ? `<div style="background:#2ecc7122;border-radius:6px;padding:0.2rem 0.3rem;color:#2ecc71;font-weight:700">${m.montant>0?m.montant.toLocaleString():'✓'}</div>`
                                    : `<div style="background:#e74c3c11;border-radius:6px;padding:0.2rem;color:#e74c3c;font-size:0.8rem">✗</div>`
                                }
                            </td>`).join('')}
                            <td style="padding:0.4rem;text-align:center;font-weight:700;color:${o.totalPaye>0?'var(--primary)':'#e74c3c'}">
                                ${o.totalPaye>0?o.totalPaye.toLocaleString()+' DH':'—'}
                            </td>
                        </tr>`).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="border-top:2px solid var(--outline-variant);font-weight:700">
                            <td style="padding:0.5rem 0.4rem;position:sticky;right:0;background:var(--surface)">المجموع</td>
                            ${moisTableau.map(mois => {
                                const tot = DonneesApp.paiements
                                    .filter(p=>p.mois===mois&&p.annee===annee)
                                    .reduce((s,p)=>s+(p.montant||0),0);
                                return `<td style="padding:0.4rem 0.2rem;text-align:center;color:var(--primary);font-size:0.7rem">${tot>0?tot.toLocaleString():'-'}</td>`;
                            }).join('')}
                            <td style="padding:0.4rem;text-align:center;color:var(--primary)">${totEntrees.toLocaleString()} DH</td>
                        </tr>
                    </tfoot>
                </table>
                </div>
            </div>

            <!-- ===== المتأخرات ===== -->
            <div style="margin-bottom:1rem">${ComposantsUI.carteRetards(SelecteursDonnees.obtenirDetailImpayes())}</div>

            <!-- ===== المصاريف حسب الفئة ===== -->
            ${catsArr.length>0 ? `
            <div class="card" style="margin-bottom:1rem;padding:1rem">
                <p style="font-size:0.9rem;font-weight:700;margin-bottom:0.75rem">📂 تفصيل المصاريف — ${titre}</p>
                ${catsArr.map(([cat,mon])=>{
                    const pct = totSorties>0 ? Math.round((mon/totSorties)*100) : 0;
                    const couleurs = {'صيانة':'#e67e22','كهرباء':'#f1c40f','تنظيف':'#3498db','حراسة':'#9b59b6','ماء':'#1abc9c','أخرى':'#95a5a6'};
                    const clr = couleurs[cat]||'#e74c3c';
                    return `<div style="margin-bottom:0.7rem">
                        <div style="display:flex;justify-content:space-between;margin-bottom:0.3rem">
                            <div style="display:flex;align-items:center;gap:0.4rem">
                                <div style="width:10px;height:10px;border-radius:50%;background:${clr}"></div>
                                <span style="font-size:0.8rem;font-weight:600">${cat}</span>
                            </div>
                            <span style="font-size:0.8rem;color:${clr};font-weight:700">${mon.toLocaleString()} DH <span style="opacity:0.6">(${pct}%)</span></span>
                        </div>
                        <div style="height:7px;background:var(--outline-variant);border-radius:4px;overflow:hidden">
                            <div style="height:7px;background:${clr};border-radius:4px;width:${pct}%"></div>
                        </div>
                    </div>`;
                }).join('')}
                <div style="border-top:1px solid var(--outline-variant);margin-top:0.5rem;padding-top:0.5rem;display:flex;justify-content:space-between">
                    <span style="font-size:0.8rem;font-weight:700">الإجمالي</span>
                    <span style="font-size:0.8rem;font-weight:700;color:#e74c3c">${totSorties.toLocaleString()} DH</span>
                </div>
            </div>` : ''}

            <!-- ===== المشاريع ===== -->
            ${DonneesApp.projets.length>0?`
            <div class="card" style="margin-bottom:1rem;padding:1rem">
                <p style="font-size:0.9rem;font-weight:700;margin-bottom:0.75rem">🔧 المشاريع الجارية</p>
                ${DonneesApp.projets.map(p=>{
                    const pct=Math.min(100,Math.round(((p.collecte||0)/(p.budget||1))*100));
                    return `<div style="margin-bottom:0.85rem;padding-bottom:0.85rem;border-bottom:1px solid var(--outline-variant)">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem">
                            <p style="font-size:0.85rem;font-weight:600">${p.titre}</p>
                            <span class="badge ${pct>=100?'badge-paid':'badge-pending'}">${pct}%</span>
                        </div>
                        <div style="height:8px;background:var(--outline-variant);border-radius:4px;overflow:hidden;margin-bottom:0.35rem">
                            <div style="height:8px;background:linear-gradient(90deg,var(--primary),#7c3aed);border-radius:4px;width:${pct}%"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between">
                            <span style="font-size:0.72rem;opacity:0.7">الهدف: ${(p.budget||0).toLocaleString()} DH</span>
                            <span style="font-size:0.72rem;color:var(--primary);font-weight:600">محصّل: ${(p.collecte||0).toLocaleString()} DH</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>`:''}

            <!-- ===== أزرار التصدير ===== -->
            <div style="display:grid;grid-template-columns:1fr auto auto;gap:0.6rem;margin-top:0.5rem">
                <button class="btn-primary" onclick="window.ControleurUI.envoyerRapportWhatsApp('${filtre}')">
                    <i class="fab fa-whatsapp" style="margin-left:0.4rem"></i> تقرير WhatsApp
                </button>
                <button style="background:#e74c3c;color:white;border:none;border-radius:12px;padding:0.9rem 1rem;cursor:pointer;font-size:0.85rem"
                        onclick="window.ControleurUI.exporterPDF('${filtre}')">
                    <i class="fas fa-file-pdf"></i>
                </button>
                <button style="background:var(--surface-container);border:1px solid var(--outline);border-radius:12px;padding:0.9rem 1rem;cursor:pointer"
                        onclick="window.print()">
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
