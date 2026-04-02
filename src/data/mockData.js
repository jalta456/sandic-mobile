/**
 * src/data/mockData.js
 * Source de vérité pour les données locales avec des sélecteurs calculés.
 */

window.DonneesApp = {
    proprietaires: [
        { id: 1, nom: "أحمد العلمي", appartement: "14", type: "مالك مقيم", statut: "paid", telephone: "0661234567" },
        { id: 2, nom: "مريم بناني", appartement: "05", type: "مالك", statut: "pending", telephone: "0667654321" },
        { id: 3, nom: "ياسين الفاسي", appartement: "22", type: "مكتري", statut: "paid", telephone: "0661122334" }
    ],
    paiements: [
        { 
            id: 1, 
            idProprietaire: 1, 
            montant: 350, 
            mois: "أكتوبر", 
            annee: "2023", 
            date: "10 أكتوبر", 
            dateIso: "2023-10-10", 
            notes: "تم الدفع نقداً",
            statut: "completed",
            idTransaction: 3,
            creeLe: "2023-10-10T10:30:00.000Z",
            misAJourLe: "2023-10-10T10:30:00.000Z"
        },
        { 
            id: 2, 
            idProprietaire: 3, 
            montant: 350, 
            mois: "أكتوبر", 
            annee: "2023", 
            date: "12 أكتوبر", 
            dateIso: "2023-10-12", 
            notes: "تحويل بنكي",
            statut: "completed",
            idTransaction: 4,
            creeLe: "2023-10-12T14:20:00.000Z",
            misAJourLe: "2023-10-12T14:20:00.000Z"
        }
    ],
    depenses: [
        { 
            id: 1, 
            titre: "إصلاح المصعد الرئيسي", 
            categorie: "صيانة", 
            montant: 1200, 
            date: "15 أكتوبر", 
            dateIso: "2023-10-15", 
            icone: "fa-tools", 
            statut: "completed",
            idTransaction: 5,
            creeLe: "2023-10-15T09:00:00.000Z",
            misAJourLe: "2023-10-15T09:00:00.000Z"
        },
        { 
            id: 2, 
            titre: "فاتورة كهرباء السلالم", 
            categorie: "مرافق", 
            montant: 4850, 
            date: "12 أكتوبر", 
            dateIso: "2023-10-12", 
            icone: "fa-bolt", 
            statut: "completed",
            idTransaction: 6,
            creeLe: "2023-10-12T11:30:00.000Z",
            misAJourLe: "2023-10-12T11:30:00.000Z"
        },
        { 
            id: 3, 
            titre: "مواد تنظيف المداخل", 
            categorie: "نظافة", 
            montant: 450, 
            date: "08 أكتوبر", 
            dateIso: "2023-10-08", 
            icone: "fa-broom", 
            statut: "completed",
            idTransaction: 7,
            creeLe: "2023-10-08T08:00:00.000Z",
            misAJourLe: "2023-10-08T08:00:00.000Z"
        }
    ],
    annonces: [
        { id: 1, titre: "اجتماع عام استثنائي", priorite: "high", contenu: "ندعوكم لحضور الاجتماع المتعلق بإصلاح واجهة العمارة", date: "25 أكتوبر" },
        { id: 2, titre: "بدء أشغال الصباغة", priorite: "medium", contenu: "ستبدأ أشغال صباغة المداخل الإثنين القادم", date: "20 أكتوبر" }
    ],
    projets: [
        {
            id: 1, titre: "إصلاح الواجهة الكبرى", budget: 35000, collecte: 21000,
            progression: 60, dateDebut: "01/09/2023", part: 500,
            description: "صباغة وترميم الواجهة الرئيسية",
            contributions: [
                { idProprietaire: 1, montant: 500, date: "05/09/2023", statut: "payé" },
                { idProprietaire: 2, montant: 500, date: "08/09/2023", statut: "payé" }
            ]
        },
        {
            id: 2, titre: "تركيب كاميرات المراقبة", budget: 8500, collecte: 8500,
            progression: 100, dateDebut: "15/08/2023", part: 200,
            description: "تركيب 8 كاميرات عالية الجودة",
            contributions: [
                { idProprietaire: 1, montant: 200, date: "20/08/2023", statut: "payé" },
                { idProprietaire: 2, montant: 200, date: "22/08/2023", statut: "payé" },
                { idProprietaire: 3, montant: 200, date: "25/08/2023", statut: "payé" }
            ]
        }
    ],
    transactionsFonds: [
        { 
            id: 1, 
            type: "deposit", 
            categorie: "deposit",
            montant: 50000, 
            date: "01 أكتوبر", 
            dateIso: "2023-10-01", 
            description: "رصيد افتتاحي",
            typeReference: "initial",
            idReference: null,
            statut: "completed",
            creeLe: "2023-10-01T00:00:00.000Z",
            misAJourLe: "2023-10-01T00:00:00.000Z"
        },
        { 
            id: 2, 
            type: "withdrawal", 
            categorie: "withdrawal",
            montant: 500, 
            date: "05 أكتوبر", 
            dateIso: "2023-10-05", 
            description: "مصاريف طارئة",
            typeReference: "manual",
            idReference: null,
            statut: "completed",
            creeLe: "2023-10-05T00:00:00.000Z",
            misAJourLe: "2023-10-05T00:00:00.000Z"
        },
        { 
            id: 3, 
            type: "deposit", 
            categorie: "payment",
            montant: 350, 
            date: "10 أكتوبر", 
            dateIso: "2023-10-10", 
            description: "دفع واجب أكتوبر - أحمد العلمي",
            typeReference: "payment",
            idReference: 1,
            statut: "completed",
            creeLe: "2023-10-10T10:30:00.000Z",
            misAJourLe: "2023-10-10T10:30:00.000Z",
            metadata: {
                idProprietaire: 1,
                mois: "أكتوبر",
                annee: "2023",
                notes: "تم الدفع نقداً"
            }
        },
        { 
            id: 4, 
            type: "deposit", 
            categorie: "payment",
            montant: 350, 
            date: "12 أكتوبر", 
            dateIso: "2023-10-12", 
            description: "دفع واجب أكتوبر - ياسين الفاسي",
            typeReference: "payment",
            idReference: 2,
            statut: "completed",
            creeLe: "2023-10-12T14:20:00.000Z",
            misAJourLe: "2023-10-12T14:20:00.000Z",
            metadata: {
                idProprietaire: 3,
                mois: "أكتوبر",
                annee: "2023",
                notes: "تحويل بنكي"
            }
        },
        { 
            id: 5, 
            type: "withdrawal", 
            categorie: "expense",
            montant: 1200, 
            date: "15 أكتوبر", 
            dateIso: "2023-10-15", 
            description: "إصلاح المصعد الرئيسي",
            typeReference: "expense",
            idReference: 1,
            statut: "completed",
            creeLe: "2023-10-15T09:00:00.000Z",
            misAJourLe: "2023-10-15T09:00:00.000Z",
            metadata: {
                categorieDepense: "صيانة",
                icone: "fa-tools"
            }
        },
        { 
            id: 6, 
            type: "withdrawal", 
            categorie: "expense",
            montant: 4850, 
            date: "12 أكتوبر", 
            dateIso: "2023-10-12", 
            description: "فاتورة كهرباء السلالم",
            typeReference: "expense",
            idReference: 2,
            statut: "completed",
            creeLe: "2023-10-12T11:30:00.000Z",
            misAJourLe: "2023-10-12T11:30:00.000Z",
            metadata: {
                categorieDepense: "مرافق",
                icone: "fa-bolt"
            }
        },
        { 
            id: 7, 
            type: "withdrawal", 
            categorie: "expense",
            montant: 450, 
            date: "08 أكتوبر", 
            dateIso: "2023-10-08", 
            description: "مواد تنظيف المداخل",
            typeReference: "expense",
            idReference: 3,
            statut: "completed",
            creeLe: "2023-10-08T08:00:00.000Z",
            misAJourLe: "2023-10-08T08:00:00.000Z",
            metadata: {
                categorieDepense: "نظافة",
                icone: "fa-broom"
            }
        }
    ],

    rappelsEnvoyes: [
        {
            id: 1,
            idProprietaire: 2,
            mois: "أكتوبر",
            annee: "2023",
            envoyeLe: "2023-10-20T09:00:00.000Z",
            methode: "whatsapp",
            statut: "delivered"
        }
    ]
};

window.SelecteursDonnees = {
    // Aide au partage de date
    estAncien(item) { return !item.dateIso; },
    
    obtenirDonneesFiltrees(collection, periode) {
        if (!collection) return [];
        if (periode === 'all') return collection;
        const maintenant = new Date("2023-10-31"); // Simulation de "maintenant"
        return collection.filter(item => {
            if (this.estAncien(item)) return true; // Conserver les anciens éléments
            const d = new Date(item.dateIso);
            if (isNaN(d.getTime())) return true; // Repli pour les mauvaises dates
            if (periode === 'month') return d.getMonth() === maintenant.getMonth() && d.getFullYear() === maintenant.getFullYear();
            if (periode === 'year') return d.getFullYear() === maintenant.getFullYear();
            return true;
        });
    },

    obtenirTotalCollectes(periode = 'all') {
        const p = this.obtenirDonneesFiltrees(DonneesApp.paiements, periode);
        const f = this.obtenirDonneesFiltrees(DonneesApp.transactionsFonds, periode).filter(t => t.type === 'deposit');
        const sommeP = p.reduce((acc, i) => acc + (Number(i.montant) || 0), 0);
        const sommeF = f.reduce((acc, i) => acc + (Number(i.montant) || 0), 0);
        return sommeP + sommeF;
    },

    obtenirTotalDepenses(periode = 'all') {
        const e = this.obtenirDonneesFiltrees(DonneesApp.depenses, periode);
        const f = this.obtenirDonneesFiltrees(DonneesApp.transactionsFonds, periode).filter(t => t.type === 'withdrawal');
        const sommeE = e.reduce((acc, i) => acc + (Number(i.montant) || 0), 0);
        const sommeF = f.reduce((acc, i) => acc + (Number(i.montant) || 0), 0);
        return sommeE + sommeF;
    },

    obtenirSolde() {
        return this.obtenirTotalCollectes('all') - this.obtenirTotalDepenses('all');
    },

    obtenirDetailImpayes() {
        const moisActuel = new Date().toLocaleString('ar-MA', { month: 'long' });
        const anneeActuelle = new Date().getFullYear().toString();
        const montantMensuel = 350;

        const retardataires = (DonneesApp.proprietaires || []).filter(proprietaire => {
            const aPayeCeMois = (DonneesApp.paiements || []).some(p =>
                p.idProprietaire === proprietaire.id &&
                p.mois === moisActuel &&
                p.annee === anneeActuelle &&
                p.statut === 'completed'
            );
            return !aPayeCeMois;
        });

        return {
            nb: retardataires.length,
            montantTotal: retardataires.length * montantMensuel,
            details: retardataires.map(p => ({
                nom: p.nom,
                appartement: p.appartement,
                telephone: p.telephone || '',
                montant: montantMensuel
            }))
        };
    },

    obtenirNombreImpayes() {
        return this.obtenirDetailImpayes().nb;
    },

    obtenirDepensesMensuelles() {
        return this.obtenirTotalDepenses('month');
    },

    obtenirActiviteRecente() {
        const activites = [
            ...(DonneesApp.paiements || []).map(p => ({ 
                type: 'payment', 
                titre: `دفع: ${this.obtenirNomProprietaire(p.idProprietaire)}`, 
                montant: p.montant, 
                date: p.date || p.dateIso,
                icone: 'fa-receipt',
                couleur: 'var(--primary)'
            })),
            ...(DonneesApp.depenses || []).map(e => ({ 
                type: 'expense', 
                titre: e.titre, 
                montant: e.montant, 
                date: e.date || e.dateIso,
                icone: e.icone,
                couleur: '#dc3545'
            }))
        ];
        return activites.sort((a, b) => new Date(b.date || b.dateIso) - new Date(a.date || a.dateIso)).slice(0, 5);
    },

    obtenirNomProprietaire(id) {
        const proprietaire = (DonneesApp.proprietaires || []).find(o => o.id === id);
        return proprietaire ? proprietaire.nom : "غير معروف";
    },

    // Sélecteurs de Transactions de Fonds
    obtenirTransactionsFonds(filtre = 'all') {
        const transactions = DonneesApp.transactionsFonds || [];

        switch(filtre) {
            case 'month':
                const moisActuel = new Date().getMonth();
                const anneeActuelle = new Date().getFullYear();
                return transactions.filter(t => {
                    const date = new Date(t.dateIso || t.date);
                    return date.getMonth() === moisActuel && 
                           date.getFullYear() === anneeActuelle;
                });
            case 'year':
                const annee = new Date().getFullYear();
                return transactions.filter(t => {
                    const date = new Date(t.dateIso || t.date);
                    return date.getFullYear() === annee;
                });
            case 'deposits':
                return transactions.filter(t => t.type === 'deposit');
            case 'withdrawals':
                return transactions.filter(t => t.type === 'withdrawal');
            case 'payments':
                return transactions.filter(t => t.categorie === 'payment');
            case 'expenses':
                return transactions.filter(t => t.categorie === 'expense');
            default:
                return transactions;
        }
    },

    obtenirSoldeFonds() {
        const transactions = this.obtenirTransactionsFonds('all');
        const depots = transactions
            .filter(t => t.type === 'deposit' && t.statut === 'completed')
            .reduce((somme, t) => somme + t.montant, 0);
        const retraits = transactions
            .filter(t => t.type === 'withdrawal' && t.statut === 'completed')
            .reduce((somme, t) => somme + t.montant, 0);
        return depots - retraits;
    },

    obtenirTransactionParId(id) {
        return DonneesApp.transactionsFonds?.find(t => t.id === id);
    },

    obtenirTransactionsParReference(idReference, typeReference) {
        return DonneesApp.transactionsFonds?.filter(t => 
            t.idReference === idReference && t.typeReference === typeReference
        ) || [];
    },

    obtenirTransactionsEnAttente() {
        return DonneesApp.transactionsFonds?.filter(t => t.statut === 'pending') || [];
    },

    // Sélecteurs de Rappels
    obtenirRappelsEnvoyes(idProprietaire = null) {
        const rappels = DonneesApp.rappelsEnvoyes || [];
        return idProprietaire 
            ? rappels.filter(r => r.idProprietaire === idProprietaire)
            : rappels;
    },

    unRappelAETEEnvoye(idProprietaire, mois, annee) {
        return this.obtenirRappelsEnvoyes(idProprietaire).some(r => 
            r.mois === mois && r.annee === annee && r.statut === 'delivered'
        );
    }
};
