/**
 * script.js
 * Contrôleur principal de l'application (Orchestrateur).
 */

const Routeur = {
    initialiser() {
        window.addEventListener('hashchange', () => this.gererChangementHash());
        this.gererChangementHash();
    },
    gererChangementHash() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        ControleurUI.mettreAJourVue(hash);
    },
    naviguer(idVue) {
        window.location.hash = idVue;
    }
};

window.ControleurUI = {
    _profilOuvert: false,

    initialiser() {
        console.log("✅ Sandic Mobile Initialisé");
        this.chargerDonnees();
        this.lierEvenementsGlobaux();
        Routeur.initialiser();
    },

    // ===== PERSISTANCE =====
    sauvegarderDonnees() {
        try {
            localStorage.setItem('sandic_data', JSON.stringify(DonneesApp));
        } catch(e) {
            console.warn("Impossible de sauvegarder:", e);
        }
    },

    chargerDonnees() {
        // mockData.js initialise toujours DonneesApp avec les données de démo.
        // Le localStorage ne fait QUE remplacer ces données si l'utilisateur a sauvegardé.
        try {
            const donneesSauvegardees = localStorage.getItem('sandic_data');
            if (!donneesSauvegardees) {
                console.log("🌱 Utilisation des données initiales de mockData.js");
                // Marquer la version pour les futures sauvegardes
                localStorage.setItem('sandic_version', '2.0');
                return;
            }
            const donnees = JSON.parse(donneesSauvegardees);
            // Vérifier que les clés sont bien en français (nouvelle structure v2.0)
            if (Array.isArray(donnees.proprietaires)) {
                const cles = ['proprietaires', 'paiements', 'depenses', 'annonces', 'projets', 'transactionsFonds', 'rappelsEnvoyes'];
                cles.forEach(cle => {
                    if (donnees[cle] !== undefined) window.DonneesApp[cle] = donnees[cle];
                });
                console.log(`📦 Données restaurées: ${donnees.proprietaires.length} propriétaires`);
            } else {
                console.warn("⚠️ Données corrompues, utilisation des données initiales");
                localStorage.removeItem('sandic_data');
            }
        } catch(e) {
            console.error("Erreur chargement données:", e);
            localStorage.removeItem('sandic_data');
        }
    },

    // ===== ÉVÉNEMENTS =====
    lierEvenementsGlobaux() {
        // FAB - Contextuel selon la vue active
        const fab = document.querySelector('.fab-squircle');
        if (fab) {
            fab.addEventListener('click', () => {
                const vueActuelle = window.location.hash.replace('#', '') || 'dashboard';
                this.ouvrirModalParVue(vueActuelle);
            });
        }

        // Fermer modal avec Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.fermerModal();
        });

        // Fermer modal en cliquant sur l'overlay (mais pas sur le sheet)
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) this.fermerModal();
            });
        }
    },

    // ===== NAVIGATION =====
    naviguerVers(idVue) {
        Routeur.naviguer(idVue);
    },

    mettreAJourVue(idVue) {
        // Masquer toutes les vues
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        // Afficher la vue cible
        const cible = document.getElementById(idVue);
        if (cible) cible.classList.add('active');

        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(i => {
            i.classList.remove('active');
            if (i.getAttribute('data-view') === idVue) i.classList.add('active');
        });

        // Table de correspondance : ID de vue HTML → fonction de rendu
        const tableRendu = {
            'dashboard':     Ecrans.tableauDeBord,
            'owners':        Ecrans.proprietaires,
            'expenses':      Ecrans.depenses,
            'payments':      Ecrans.paiements,
            'projects':      Ecrans.projets,
            'announcements': Ecrans.annonces,
            'fund':          Ecrans.fonds,
            'reports':       Ecrans.rapports,
            'receipts':      Ecrans.receipts,
        };

        const rendu = tableRendu[idVue];
        if (rendu) {
            rendu.call(Ecrans);
        }

        window.scrollTo(0, 0);
    },

    // ===== MODAL =====
    ouvrirModalParVue(idVue) {
        const contenuModal = document.getElementById('modalContent');
        if (!contenuModal) return;

        switch(idVue) {
            case 'owners':      contenuModal.innerHTML = ComposantsUI.formulaireProprietaire(); break;
            case 'payments':    contenuModal.innerHTML = ComposantsUI.formulairePaiement(); break;
            case 'expenses':    contenuModal.innerHTML = ComposantsUI.formulaireDepense(); break;
            case 'projects':    contenuModal.innerHTML = ComposantsUI.formulaireProjet(); break;
            case 'announcements': contenuModal.innerHTML = ComposantsUI.formulaireAnnonce(); break;
            case 'fund':        contenuModal.innerHTML = ComposantsUI.formulaireFonds(); break;
            default:
                contenuModal.innerHTML = `
                    <div style="padding:1.5rem">
                        <p class="title-lg mb-4" style="text-align:center">ماذا تريد أن تضيف؟</p>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
                            <button class="card" style="text-align:center;cursor:pointer;padding:1rem" onclick="ControleurUI.fermerModal();ControleurUI.naviguerVers('payments');setTimeout(()=>ControleurUI.ouvrirModalParVue('payments'),300)">
                                <i class="fas fa-calendar-check" style="font-size:1.5rem;color:var(--primary);display:block;margin-bottom:0.5rem"></i>
                                <p>تسجيل أداء</p>
                            </button>
                            <button class="card" style="text-align:center;cursor:pointer;padding:1rem" onclick="ControleurUI.fermerModal();ControleurUI.naviguerVers('expenses');setTimeout(()=>ControleurUI.ouvrirModalParVue('expenses'),300)">
                                <i class="fas fa-file-invoice-dollar" style="font-size:1.5rem;color:#e74c3c;display:block;margin-bottom:0.5rem"></i>
                                <p>إضافة مصروف</p>
                            </button>
                            <button class="card" style="text-align:center;cursor:pointer;padding:1rem" onclick="ControleurUI.fermerModal();ControleurUI.naviguerVers('owners');setTimeout(()=>ControleurUI.ouvrirModalParVue('owners'),300)">
                                <i class="fas fa-user-plus" style="font-size:1.5rem;color:var(--primary);display:block;margin-bottom:0.5rem"></i>
                                <p>إضافة مالك</p>
                            </button>
                            <button class="card" style="text-align:center;cursor:pointer;padding:1rem" onclick="ControleurUI.fermerModal();ControleurUI.naviguerVers('fund');setTimeout(()=>ControleurUI.ouvrirModalParVue('fund'),300)">
                                <i class="fas fa-vault" style="font-size:1.5rem;color:#2ecc71;display:block;margin-bottom:0.5rem"></i>
                                <p>عملية صندوق</p>
                            </button>
                        </div>
                    </div>`;
        }

        document.getElementById('modalOverlay').classList.add('active');
    },

    ouvrirModalParVuePourProprietaire(idProprietaire) {
        const contenuModal = document.getElementById('modalContent');
        if (!contenuModal) return;
        contenuModal.innerHTML = ComposantsUI.formulairePaiement(idProprietaire);
        document.getElementById('modalOverlay').classList.add('active');
    },

    fermerModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.classList.remove('active');
    },

    // ===== PROFIL PROPRIÉTAIRE =====
    ouvrirProfilProprietaire(idProprietaire) {
        const section = document.getElementById('ownerProfile');
        if (!section) return;

        this._profilOuvert = true;
        // Masquer la vue owners, afficher le profil
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        section.classList.add('active');

        // Mettre à jour le bouton retour
        const btnRetour = document.getElementById('ownerProfileBackBtn');
        if (btnRetour) btnRetour.setAttribute('data-from', 'owners');

        Ecrans.profilProprietaire(idProprietaire);
    },

    fermerProfilProprietaire() {
        this._profilOuvert = false;
        this.naviguerVers('owners');
    },

    // ===== VALIDATION =====
    obtenirValeurChamp(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    },

    validerChamp(id, condition) {
        const el = document.getElementById(id);
        if (!el) return false;
        const valide = condition(el.value);
        el.style.borderColor = valide ? '' : '#e74c3c';
        return valide;
    },

    // ===== GESTIONNAIRES DE SOUMISSION =====
    gererSoumissionProprietaire() {
        const nom = this.obtenirValeurChamp('nomProprietaire');
        const appartement = this.obtenirValeurChamp('appartProprietaire');

        if (!nom) { alert('يرجى إدخال اسم المالك'); document.getElementById('nomProprietaire').focus(); return; }
        if (!appartement) { alert('يرجى إدخال رقم الشقة'); document.getElementById('appartProprietaire').focus(); return; }

        // Vérifier doublon d'appartement
        const doublon = DonneesApp.proprietaires.find(p => p.appartement === appartement);
        if (doublon) { alert(`الشقة ${appartement} مسجلة باسم: ${doublon.nom}`); return; }

        const nouvellId = (DonneesApp.proprietaires.length > 0 ? Math.max(...DonneesApp.proprietaires.map(p => p.id)) : 0) + 1;
        const donnees = {
            id: nouvellId,
            nom: nom,
            appartement: appartement,
            telephone: this.obtenirValeurChamp('telProprietaire'),
            type: this.obtenirValeurChamp('typeProprietaire') || 'مالك مقيم',
            statut: 'pending'
        };

        DonneesApp.proprietaires.push(donnees);
        this.finaliserAction('تمت إضافة المالك بنجاح ✓', 'owners');
    },

    gererSoumissionPaiement() {
        const idProp = Number(this.obtenirValeurChamp('payIdProprietaire'));
        const montant = Number(this.obtenirValeurChamp('payMontant'));
        const mois = this.obtenirValeurChamp('payMois');
        const annee = this.obtenirValeurChamp('payAnnee');

        if (!idProp) { alert('يرجى اختيار المالك'); return; }
        if (!montant || montant <= 0) { alert('يرجى إدخال مبلغ صحيح أكبر من 0'); return; }
        if (!mois) { alert('يرجى اختيار الشهر'); return; }
        if (!annee) { alert('يرجى إدخال السنة'); return; }

        // Vérifier doublon de paiement
        const doublon = DonneesApp.paiements.find(p =>
            p.idProprietaire === idProp &&
            p.mois === mois &&
            p.annee === annee &&
            p.statut === 'completed'
        );
        if (doublon) { alert(`هذا المالك قد سبق له أداء واجب ${mois} ${annee}`); return; }

        const maintenant = new Date();
        const nouvellId = (DonneesApp.paiements.length > 0 ? Math.max(...DonneesApp.paiements.map(p => p.id)) : 0) + 1;
        const nouvellIdTransaction = (DonneesApp.transactionsFonds.length > 0 ? Math.max(...DonneesApp.transactionsFonds.map(t => t.id)) : 0) + 1;

        const donneesPaiement = {
            id: nouvellId,
            idProprietaire: idProp,
            montant: montant,
            mois: mois,
            annee: annee,
            date: maintenant.toLocaleDateString('ar-MA', { day: 'numeric', month: 'long' }),
            dateIso: maintenant.toISOString().split('T')[0],
            notes: this.obtenirValeurChamp('payNotes'),
            statut: 'completed',
            idTransaction: nouvellIdTransaction,
            creeLe: maintenant.toISOString(),
            misAJourLe: maintenant.toISOString()
        };

        DonneesApp.paiements.push(donneesPaiement);

        // Créer la transaction dans le fonds
        const nomProp = SelecteursDonnees.obtenirNomProprietaire(idProp);
        DonneesApp.transactionsFonds.push({
            id: nouvellIdTransaction,
            type: 'deposit',
            categorie: 'payment',
            montant: montant,
            description: `دفع واجب ${mois} ${annee} - ${nomProp}`,
            date: donneesPaiement.date,
            dateIso: donneesPaiement.dateIso,
            typeReference: 'payment',
            idReference: nouvellId,
            statut: 'completed',
            creeLe: maintenant.toISOString(),
            misAJourLe: maintenant.toISOString(),
            metadata: { idProprietaire: idProp, mois, annee, notes: donneesPaiement.notes }
        });

        // Mettre à jour le statut du propriétaire
        const prop = DonneesApp.proprietaires.find(o => o.id === idProp);
        if (prop) prop.statut = 'paid';

        // Proposer d'envoyer WhatsApp
        const success = this.finaliserAction(`تم تسجيل أداء ${mois} ${annee} بنجاح ✓`, 'payments');
        if (prop && prop.telephone) {
            setTimeout(() => {
                if (confirm('هل تريد إرسال الوصل عبر WhatsApp؟')) {
                    const msg = `🧾 وصل دفع - السانديك\n\n✅ تم استلام ${montant} DH\nواجب ${mois} ${annee}\n👤 ${prop.nom} - شقة ${prop.appartement}\n\nشكراً!`;
                    window.open(`https://wa.me/212${prop.telephone.substring(1)}?text=${encodeURIComponent(msg)}`, '_blank');
                }
            }, 500);
        }
    },

    gererSoumissionDepense() {
        const titre = this.obtenirValeurChamp('titreDepense');
        const montant = Number(this.obtenirValeurChamp('montantDepense'));

        if (!titre) { alert('يرجى إدخال عنوان المصروف'); document.getElementById('titreDepense').focus(); return; }
        if (!montant || montant <= 0) { alert('يرجى إدخال مبلغ صحيح أكبر من 0'); document.getElementById('montantDepense').focus(); return; }

        const categorie = this.obtenirValeurChamp('catDepense') || 'أخرى';
        const icones = { 'صيانة': 'fa-tools', 'مرافق': 'fa-bolt', 'نظافة': 'fa-broom', 'أخرى': 'fa-file-invoice-dollar' };
        const maintenant = new Date();
        const nouvellId = (DonneesApp.depenses.length > 0 ? Math.max(...DonneesApp.depenses.map(d => d.id)) : 0) + 1;
        const nouvellIdTransaction = (DonneesApp.transactionsFonds.length > 0 ? Math.max(...DonneesApp.transactionsFonds.map(t => t.id)) : 0) + 1;

        const donneesDepense = {
            id: nouvellId,
            titre: titre,
            categorie: categorie,
            montant: montant,
            date: maintenant.toLocaleDateString('ar-MA', { day: 'numeric', month: 'long' }),
            dateIso: maintenant.toISOString().split('T')[0],
            icone: icones[categorie] || 'fa-money-bill',
            statut: 'completed',
            idTransaction: nouvellIdTransaction,
            creeLe: maintenant.toISOString(),
            misAJourLe: maintenant.toISOString()
        };

        DonneesApp.depenses.push(donneesDepense);

        // Créer la transaction dans le fonds
        DonneesApp.transactionsFonds.push({
            id: nouvellIdTransaction,
            type: 'withdrawal',
            categorie: 'expense',
            montant: montant,
            description: `مصروف: ${titre} - ${categorie}`,
            date: donneesDepense.date,
            dateIso: donneesDepense.dateIso,
            typeReference: 'expense',
            idReference: nouvellId,
            statut: 'completed',
            creeLe: maintenant.toISOString(),
            misAJourLe: maintenant.toISOString(),
            metadata: { categorieDepense: categorie, icone: donneesDepense.icone, titre: titre }
        });

        this.finaliserAction('تم تسجيل المصروف بنجاح ✓', 'expenses');
    },

    gererSoumissionProjet() {
        const titre = this.obtenirValeurChamp('titreProjet');
        const budget = Number(this.obtenirValeurChamp('budgetProjet'));

        if (!titre) { alert('يرجى إدخال اسم المشروع'); return; }
        if (!budget || budget <= 0) { alert('يرجى إدخال ميزانية صحيحة'); return; }

        const nouvellId = (DonneesApp.projets.length > 0 ? Math.max(...DonneesApp.projets.map(p => p.id)) : 0) + 1;
        DonneesApp.projets.push({
            id: nouvellId,
            titre: titre,
            budget: budget,
            collecte: 0,
            progression: 0,
            part: Number(this.obtenirValeurChamp('partProjet')) || 0,
            dateDebut: new Date().toLocaleDateString(),
            dateIso: new Date().toISOString().split('T')[0],
            description: this.obtenirValeurChamp('descProjet')
        });

        this.finaliserAction('تم إنشاء المشروع بنجاح ✓', 'projects');
    },

    gererSoumissionAnnonce() {
        const titre = this.obtenirValeurChamp('titreAnnonce');
        const contenu = this.obtenirValeurChamp('contenuAnnonce');

        if (!titre) { alert('يرجى إدخال عنوان الإعلان'); return; }
        if (!contenu) { alert('يرجى إدخال محتوى الإعلان'); return; }

        const nouvellId = (DonneesApp.annonces.length > 0 ? Math.max(...DonneesApp.annonces.map(a => a.id)) : 0) + 1;
        DonneesApp.annonces.push({
            id: nouvellId,
            titre: titre,
            priorite: this.obtenirValeurChamp('prioriteAnnonce') || 'medium',
            contenu: contenu,
            date: new Date().toLocaleDateString('ar-MA', { day: 'numeric', month: 'long' }),
            dateIso: new Date().toISOString().split('T')[0]
        });

        this.finaliserAction('تم نشر الإعلان بنجاح ✓', 'announcements');
    },

    gererSoumissionFonds() {
        const type = document.querySelector('input[name="typeFonds"]:checked');
        const montant = Number(this.obtenirValeurChamp('montantFonds'));
        const description = this.obtenirValeurChamp('descFonds');

        if (!type) { alert('يرجى اختيار نوع العملية'); return; }
        if (!montant || montant <= 0) { alert('يرجى إدخال مبلغ صحيح أكبر من 0'); return; }
        if (!description) { alert('يرجى إدخال وصف للعملية'); return; }

        // Vérifier le solde pour les retraits
        if (type.value === 'withdrawal') {
            const solde = SelecteursDonnees.obtenirSoldeFonds();
            if (montant > solde) {
                alert(`الرصيد غير كافٍ. الرصيد الحالي: ${solde.toLocaleString()} DH`);
                return;
            }
        }

        const maintenant = new Date();
        const nouvellId = (DonneesApp.transactionsFonds.length > 0 ? Math.max(...DonneesApp.transactionsFonds.map(t => t.id)) : 0) + 1;
        DonneesApp.transactionsFonds.push({
            id: nouvellId,
            type: type.value,
            categorie: type.value,
            montant: montant,
            date: maintenant.toLocaleDateString('ar-MA', { day: 'numeric', month: 'long' }),
            dateIso: maintenant.toISOString().split('T')[0],
            description: description,
            typeReference: 'manual',
            idReference: null,
            statut: 'completed',
            creeLe: maintenant.toISOString(),
            misAJourLe: maintenant.toISOString()
        });

        this.finaliserAction(`تمت ${type.value === 'deposit' ? 'عملية الإيداع' : 'عملية السحب'} بنجاح ✓`, 'fund');
    },

    // ===== ACTIONS FINALISATION =====
    finaliserAction(message, vueAActualiser) {
        this.sauvegarderDonnees();
        this.fermerModal();
        this.mettreAJourVue(vueAActualiser || (window.location.hash.replace('#', '') || 'dashboard'));
        // Notification de succès
        this.afficherNotification(message);
        return true;
    },

    afficherNotification(message) {
        const notif = document.createElement('div');
        notif.innerHTML = message;
        notif.style.cssText = `
            position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
            background: var(--primary); color: white;
            padding: 0.75rem 1.5rem; border-radius: 12px;
            font-size: 0.9rem; font-weight: 600;
            z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
            max-width: 90vw; text-align: center;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    },

    // ===== FILTRES =====
    gererChangementFiltre(periode) {
        Ecrans.rapports(periode);
    },

    // ===== RECHERCHE =====
    gererRecherche(vueId, valeur) {
        const conteneur = document.getElementById(`${vueId}Content`);
        if (!conteneur) return;

        const terme = valeur.toLowerCase().trim();
        if (!terme) {
            Ecrans[vueId] && Ecrans[vueId].call(Ecrans);
            return;
        }

        if (vueId === 'owners') {
            const resultats = DonneesApp.proprietaires.filter(o =>
                o.nom.toLowerCase().includes(terme) ||
                o.appartement.toLowerCase().includes(terme) ||
                (o.telephone || '').includes(terme)
            );
            conteneur.innerHTML = resultats.length
                ? resultats.map(o => ComposantsUI.carteProprietaire(o)).join('')
                : ComposantsUI.etatVide(`لا توجد نتائج لـ "${valeur}"`, 'fa-search');
        }
    },

    // ===== WHATSAPP =====
    ouvrirWhatsApp(tel, type) {
        let message = '';
        const telNettoye = (tel || '').replace(/\s/g, '').replace(/\D/g, '');

        switch(type) {
            case 'monthly_report':
                const solde = SelecteursDonnees.obtenirSolde();
                const retards = SelecteursDonnees.obtenirDetailImpayes();
                message = `📊 *تقرير مالي - مجمع السانديك*\n\n💰 الرصيد الحالي: ${solde.toLocaleString()} DH\n\n⚠️ المتأخرات:\n- عدد الملاك: ${retards.nb}\n- المبلغ الإجمالي: ${retards.montantTotal.toLocaleString()} DH\n\n📅 ${new Date().toLocaleDateString('ar-MA', { day:'numeric', month:'long', year:'numeric' })}`;
                break;
            case 'payment_reminder':
                message = `🔔 *تذكير - واجب السانديك*\n\nالسلام عليكم ورحمة الله،\nنرجو منكم أداء واجب السانديك لهذا الشهر في أقرب وقت.\nشكراً لتعاونكم! 🙏`;
                break;
            default:
                if (type && type.startsWith('receipt_')) {
                    const idRecu = Number(type.replace('receipt_', ''));
                    const paiement = DonneesApp.paiements.find(p => p.id === idRecu);
                    if (paiement) {
                        const prop = DonneesApp.proprietaires.find(o => o.id === paiement.idProprietaire);
                        message = `🧾 *وصل دفع - السانديك*\n\n✅ تم استلام: ${paiement.montant} DH\n📅 واجب ${paiement.mois} ${paiement.annee}\n👤 ${prop ? prop.nom : 'المالك'}\n\nشكراً! 🙏`;
                    }
                } else {
                    message = 'السلام عليكم، معكم مسؤول مجمع السانديك.';
                }
        }

        if (telNettoye && telNettoye.length >= 9) {
            const num = telNettoye.startsWith('212') ? telNettoye : `212${telNettoye.startsWith('0') ? telNettoye.substring(1) : telNettoye}`;
            window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        }
    },

    // ===== REÇUS =====
    afficherDetailRecu(idPaiement) {
        const paiement = DonneesApp.paiements.find(p => p.id === idPaiement);
        if (!paiement) return;
        const prop = DonneesApp.proprietaires.find(o => o.id === paiement.idProprietaire);

        const modal = document.getElementById('modalContent');
        if (!modal) return;

        modal.innerHTML = `
            <div style="padding:1.5rem;direction:rtl;text-align:center">
                <h2 style="font-size:1.2rem;margin-bottom:1rem">🧾 وصل دفع</h2>
                <div style="border:2px dashed var(--outline-variant);border-radius:16px;padding:1.5rem;margin-bottom:1rem">
                    <div style="margin-bottom:1rem">
                        <i class="fas fa-user-circle" style="font-size:3rem;color:var(--primary);margin-bottom:0.5rem;display:block"></i>
                        <p style="font-size:1.1rem;font-weight:700">${prop ? prop.nom : 'غير معروف'}</p>
                        <p class="body-md">شقة ${prop ? prop.appartement : '-'}</p>
                    </div>
                    <div style="background:var(--primary)11;border-radius:12px;padding:1rem;margin-bottom:0.75rem">
                        <p class="body-md">المبلغ المدفوع</p>
                        <p style="font-size:2rem;font-weight:700;color:var(--primary)">${(paiement.montant||0).toLocaleString()} DH</p>
                        <p class="body-md">واجب ${paiement.mois} ${paiement.annee}</p>
                    </div>
                    <div style="text-align:right">
                        <p class="body-md">📅 تاريخ الأداء: <strong>${paiement.date || paiement.dateIso}</strong></p>
                        ${paiement.notes ? `<p class="body-md">📝 ملاحظات: ${paiement.notes}</p>` : ''}
                        <p class="body-md">🔢 رقم الوصل: #${paiement.id}</p>
                    </div>
                </div>
                <div style="display:flex;gap:0.75rem">
                    <button onclick="ControleurUI.ouvrirWhatsApp('${prop ? prop.telephone : ''}', 'receipt_${paiement.id}')"
                            style="flex:1;background:#25D366;color:white;border:none;border-radius:12px;padding:0.75rem;cursor:pointer;font-size:0.9rem">
                        <i class="fab fa-whatsapp"></i> إرسال WhatsApp
                    </button>
                    <button onclick="ControleurUI.imprimerRecu(${paiement.id})"
                            style="flex:1;background:var(--primary);color:white;border:none;border-radius:12px;padding:0.75rem;cursor:pointer;font-size:0.9rem">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                </div>
            </div>`;
        document.getElementById('modalOverlay').classList.add('active');
    },

    imprimerRecu(idPaiement) {
        const paiement = DonneesApp.paiements.find(p => p.id === idPaiement);
        if (!paiement) return;
        const prop = DonneesApp.proprietaires.find(o => o.id === paiement.idProprietaire);

        const fenetre = window.open('', '_blank');
        fenetre.document.write(`
            <!DOCTYPE html><html dir="rtl"><head>
            <meta charset="UTF-8"><title>وصل دفع</title>
            <style>body{font-family:Arial,sans-serif;padding:2rem;direction:rtl} .border-dash{border:2px dashed #ccc;padding:1.5rem;border-radius:8px;max-width:400px;margin:0 auto}</style>
            </head><body>
            <div class="border-dash">
                <h2 style="text-align:center;margin-bottom:1rem">🧾 وصل دفع - السانديك</h2>
                <hr>
                <p>رقم الوصل: #${paiement.id}</p>
                <p>المالك: <strong>${prop ? prop.nom : '-'}</strong></p>
                <p>الشقة: ${prop ? prop.appartement : '-'}</p>
                <p>المبلغ: <strong>${paiement.montant} DH</strong></p>
                <p>الشهر: ${paiement.mois} ${paiement.annee}</p>
                <p>التاريخ: ${paiement.date || paiement.dateIso}</p>
                ${paiement.notes ? `<p>ملاحظات: ${paiement.notes}</p>` : ''}
                <hr>
                <p style="text-align:center">شكراً لتعاونكم! 🙏</p>
            </div>
            <script>window.print();window.close();</script>
            </body></html>`);
        fenetre.document.close();
    }
};

// Ajouter l'animation CSS pour les notifications
const styleNotif = document.createElement('style');
styleNotif.textContent = `
@keyframes slideDown {
    from { top: 40px; opacity: 0; }
    to   { top: 80px; opacity: 1; }
}
.segment-item.active { background: var(--primary) !important; color: white !important; }
`;
document.head.appendChild(styleNotif);

// Bootstrap
window.onload = () => window.ControleurUI.initialiser();
