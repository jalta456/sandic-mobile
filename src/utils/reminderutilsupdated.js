/**
 * src/utils/reminderUtils.js
 * Utilitaires de rappels pour les propriétaires en retard de paiement.
 */

window.UtilitairesRappels = {
    /**
     * Obtenir les propriétaires en retard avec les détails
     */
    obtenirProprietairesRetardataires() {
        const moisActuel = new Date().toLocaleString('ar-MA', { month: 'long' });
        const anneeActuelle = new Date().getFullYear().toString();

        return DonneesApp.proprietaires.filter(proprietaire => {
            // Vérifier si le propriétaire a des paiements non effectués pour le mois actuel
            const aDesPaiementsNonEffectues = !DonneesApp.paiements.some(p => 
                p.idProprietaire === proprietaire.id && 
                p.mois === moisActuel && 
                p.annee === anneeActuelle &&
                p.statut === StatutTransaction.COMPLETE
            );

            return proprietaire.statut !== 'paid' && aDesPaiementsNonEffectues;
        }).map(proprietaire => {
            // Calculer le montant en retard
            const montantMensuel = 350; // Montant mensuel par défaut
            const moisEnRetard = this.obtenirMoisEnRetard(proprietaire.id);
            const totalDu = moisEnRetard.length * montantMensuel;

            return {
                ...proprietaire,
                moisEnRetard,
                totalDu,
                montantMensuel
            };
        });
    },

    /**
     * Obtenir les mois en retard pour un propriétaire spécifique
     */
    obtenirMoisEnRetard(idProprietaire) {
        const moisActuel = new Date().toLocaleString('ar-MA', { month: 'long' });
        const anneeActuelle = new Date().getFullYear().toString();

        const mois = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", 
                      "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];

        const indexMoisActuel = mois.indexOf(moisActuel);

        // Obtenir tous les mois jusqu'au mois actuel qui ne sont pas payés
        return mois.slice(0, indexMoisActuel + 1).filter(m => {
            return !DonneesApp.paiements.some(p => 
                p.idProprietaire === idProprietaire && 
                p.mois === m && 
                p.annee === anneeActuelle &&
                p.statut === StatutTransaction.COMPLETE
            );
        });
    },

    /**
     * Générer un rappel pour un propriétaire spécifique
     */
    genererRappel(proprietaire) {
        const moisEnRetard = this.obtenirMoisEnRetard(proprietaire.id);
        const montantMensuel = 350; // Montant mensuel par défaut
        const totalDu = moisEnRetard.length * montantMensuel;

        return UtilitairesWhatsApp.genererRappelPaiement(proprietaire, moisEnRetard, totalDu);
    },

    /**
     * Envoyer un rappel à un propriétaire spécifique
     */
    envoyerRappel(proprietaire) {
        const rappel = this.genererRappel(proprietaire);
        const telProprietaire = proprietaire ? proprietaire.telephone : null;

        if (telProprietaire) {
            // Valider le numéro de téléphone
            const validation = ValidateurTelephone.validerTelephone(telProprietaire);
            if (!validation.estValide) {
                return {
                    success: false,
                    erreurs: [validation.erreur]
                };
            }

            // Envoyer le rappel via WhatsApp
            UtilitairesWhatsApp.ouvrirWhatsApp(telProprietaire, rappel);

            // Suivre le rappel
            const moisActuel = new Date().toLocaleString('ar-MA', { month: 'long' });
            const anneeActuelle = new Date().getFullYear().toString();

            if (!DonneesApp.rappelsEnvoyes) {
                DonneesApp.rappelsEnvoyes = [];
            }

            DonneesApp.rappelsEnvoyes.push({
                id: (DonneesApp.rappelsEnvoyes.length || 0) + 1,
                idProprietaire: proprietaire.id,
                mois: moisActuel,
                annee: anneeActuelle,
                envoyeLe: new Date().toISOString(),
                methode: 'whatsapp',
                statut: 'delivered',
                metadata: {
                    pays: validation.pays,
                    telFormate: validation.formate
                }
            });

            return {
                success: true,
                rappel,
                proprietaire,
                validationTelephone: validation
            };
        }

        return {
            success: false,
            erreurs: ['رقم هاتف المالك غير متوفر']
        };
    },

    /**
     * Envoyer des rappels à tous les propriétaires en retard
     */
    envoyerTousLesRappels() {
        const proprietairesRetardataires = this.obtenirProprietairesRetardataires();
        let nbEnvoyes = 0;
        const resultats = [];

        proprietairesRetardataires.forEach(proprietaire => {
            const resultat = this.envoyerRappel(proprietaire);
            resultats.push(resultat);
            if (resultat.success) {
                nbEnvoyes++;
            }
        });

        return {
            success: true,
            nbEnvoyes,
            totalRetardataires: proprietairesRetardataires.length,
            resultats
        };
    },

    /**
     * Générer un résumé des rappels groupés
     */
    genererResumeRappelsGroupes() {
        const proprietairesRetardataires = this.obtenirProprietairesRetardataires();
        const totalDu = proprietairesRetardataires.reduce((somme, proprietaire) => somme + proprietaire.totalDu, 0);

        return `📊 *ملخص التذكيرات*

⚠️ عدد الملاك المتأخرين: ${proprietairesRetardataires.length}
💵 المبلغ الإجمالي المستحق: ${totalDu.toLocaleString()} درهم

📋 *تفاصيل الملاك المتأخرين:*
${proprietairesRetardataires.map(proprietaire => `
• ${proprietaire.nom} (شقة ${proprietaire.appartement})
  - الأشهر المتأخرة: ${proprietaire.moisEnRetard.join('، ')}
  - المبلغ المستحق: ${proprietaire.totalDu.toLocaleString()} درهم
`).join('\n')}

📅 *التاريخ:* ${new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    },

    /**
     * Marquer un rappel comme envoyé pour un propriétaire
     */
    marquerRappelEnvoye(idProprietaire, mois, annee) {
        if (!DonneesApp.rappelsEnvoyes) {
            DonneesApp.rappelsEnvoyes = [];
        }

        DonneesApp.rappelsEnvoyes.push({
            id: (DonneesApp.rappelsEnvoyes.length || 0) + 1,
            idProprietaire,
            mois,
            annee,
            envoyeLe: new Date().toISOString(),
            methode: 'whatsapp',
            statut: 'delivered'
        });
    },

    /**
     * Vérifier si un rappel a été envoyé
     */
    estRappelEnvoye(idProprietaire, mois, annee) {
        return SelecteursDonnees.estRappelEnvoye(idProprietaire, mois, annee);
    },

    /**
     * Obtenir les statistiques des rappels
     */
    obtenirStatsRappels() {
        const rappels = DonneesApp.rappelsEnvoyes || [];
        const moisActuel = new Date().toLocaleString('ar-MA', { month: 'long' });
        const anneeActuelle = new Date().getFullYear().toString();

        const rappelsDuMois = rappels.filter(r => 
            r.mois === moisActuel && r.annee === anneeActuelle
        );

        const rappelsLivres = rappelsDuMois.filter(r => r.statut === 'delivered');

        return {
            totalEnvoyes: rappelsDuMois.length,
            totalLivres: rappelsLivres.length,
            tauxLivraison: rappelsDuMois.length > 0 
                ? (rappelsLivres.length / rappelsDuMois.length * 100).toFixed(2) + '%'
                : '0%'
        };
    }
};
