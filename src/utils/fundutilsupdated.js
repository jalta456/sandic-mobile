/**
 * src/utils/fundUtils.js
 * Utilitaires d'intégration des fonds pour les paiements et les dépenses.
 */

window.UtilitairesFonds = {
    /**
     * Traiter le paiement et mettre à jour les fonds
     */
    traiterPaiement(paiement) {
        // Valider le paiement
        const validation = ValidateurTransaction.validerPaiement(paiement);
        if (!validation.estValide) {
            return {
                success: false,
                erreurs: validation.erreurs
            };
        }

        // Vérifier les doublons de paiement
        if (VerificateurDoublons.verifierDoublonPaiement(paiement)) {
            return {
                success: false,
                erreurs: ['يوجد دفع مسجل لهذا الشهر والسنة']
            };
        }

        // Créer le paiement avec statut
        const paiementAvecStatut = {
            ...paiement,
            statut: StatutTransaction.COMPLETE,
            creeLe: new Date().toISOString(),
            misAJourLe: new Date().toISOString()
        };

        // Ajouter le paiement au tableau des paiements
        DonneesApp.paiements.push(paiementAvecStatut);

        // Créer la transaction de fonds pour le dépôt
        const transactionFonds = {
            id: (DonneesApp.transactionsFonds?.length || 0) + 1,
            type: TypesTransaction.DEPOT,
            categorie: CategoriesTransaction.PAIEMENT,
            montant: paiement.montant,
            description: `دفع واجب ${paiement.mois} ${paiement.annee} - ${SelecteursDonnees.obtenirNomProprietaire(paiement.idProprietaire)}`,
            date: paiement.date,
            dateIso: paiement.dateIso,
            typeReference: 'payment',
            idReference: paiementAvecStatut.id,
            statut: StatutTransaction.COMPLETE,
            creeLe: new Date().toISOString(),
            misAJourLe: new Date().toISOString(),
            metadata: {
                idProprietaire: paiement.idProprietaire,
                mois: paiement.mois,
                annee: paiement.annee,
                notes: paiement.notes
            }
        };

        // Ajouter aux transactions de fonds
        if (!DonneesApp.transactionsFonds) {
            DonneesApp.transactionsFonds = [];
        }
        DonneesApp.transactionsFonds.push(transactionFonds);

        // Mettre à jour le paiement avec l'ID de transaction
        paiementAvecStatut.idTransaction = transactionFonds.id;

        // Mettre à jour le statut du propriétaire
        const proprietaire = DonneesApp.proprietaires.find(o => o.id === paiement.idProprietaire);
        if (proprietaire) {
            proprietaire.statut = 'paid';
        }

        // Générer le message du reçu
        const message = window.WhatsAppUtils ? WhatsAppUtils.generateReceipt(paiementAvecStatut) : "";
        const telProprietaire = proprietaire ? proprietaire.telephone : null;

        return {
            success: true,
            paiement: paiementAvecStatut,
            transactionFonds,
            message,
            telProprietaire
        };
    },

    /**
     * Traiter la dépense et mettre à jour les fonds
     */
    traiterDepense(depense) {
        // Valider la dépense
        const validation = ValidateurTransaction.validerDepense(depense);
        if (!validation.estValide) {
            return {
                success: false,
                erreurs: validation.erreurs
            };
        }

        // Vérifier le solde
        const solde = SelecteursDonnees.obtenirSolde();
        if (depense.montant > solde) {
            return {
                success: false,
                erreurs: ['الرصيد غير كافٍ'],
                solde
            };
        }

        // Créer la dépense avec statut
        const depenseAvecStatut = {
            ...depense,
            statut: StatutTransaction.COMPLETE,
            creeLe: new Date().toISOString(),
            misAJourLe: new Date().toISOString()
        };

        // Ajouter la dépense au tableau des dépenses
        DonneesApp.depenses.push(depenseAvecStatut);

        // Créer la transaction de fonds pour le retrait
        const transactionFonds = {
            id: (DonneesApp.transactionsFonds?.length || 0) + 1,
            type: TypesTransaction.RETRAIT,
            categorie: CategoriesTransaction.DEPENSE,
            montant: depense.montant,
            description: `مصروف: ${depense.titre} - ${depense.categorie}`,
            date: depense.date,
            dateIso: depense.dateIso,
            typeReference: 'expense',
            idReference: depenseAvecStatut.id,
            statut: StatutTransaction.COMPLETE,
            creeLe: new Date().toISOString(),
            misAJourLe: new Date().toISOString(),
            metadata: {
                categorieDepense: depense.categorie,
                icone: depense.icone,
                titre: depense.titre
            }
        };

        // Ajouter aux transactions de fonds
        if (!DonneesApp.transactionsFonds) {
            DonneesApp.transactionsFonds = [];
        }
        DonneesApp.transactionsFonds.push(transactionFonds);

        // Mettre à jour la dépense avec l'ID de transaction
        depenseAvecStatut.idTransaction = transactionFonds.id;

        // Générer la notification de transaction
        const message = window.WhatsAppUtils ? WhatsAppUtils.generateFundTransaction(transactionFonds) : "";

        return {
            success: true,
            depense: depenseAvecStatut,
            transactionFonds,
            message
        };
    },

    /**
     * Obtenir le résumé des fonds
     */
    obtenirResumeFonds() {
        const transactions = DonneesApp.transactionsFonds || [];

        const depots = transactions.filter(t => t.type === TypesTransaction.DEPOT && t.statut === StatutTransaction.COMPLETE);
        const retraits = transactions.filter(t => t.type === TypesTransaction.RETRAIT && t.statut === StatutTransaction.COMPLETE);

        const totalDepots = depots.reduce((somme, t) => somme + t.montant, 0);
        const totalRetraits = retraits.reduce((somme, t) => somme + t.montant, 0);
        const solde = totalDepots - totalRetraits;

        return {
            totalDepots,
            totalRetraits,
            solde,
            nbTransactions: transactions.length,
            transactionsRecentes: transactions.slice(-5).reverse()
        };
    },

    /**
     * Obtenir les transactions par période
     */
    obtenirTransactionsParPeriode(dateDebut, dateFin) {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        return DonneesApp.transactionsFonds.filter(t => {
            const date = new Date(t.dateIso || t.date);
            return date >= debut && date <= fin;
        });
    },

    /**
     * Obtenir les transactions par type
     */
    obtenirTransactionsParType(type) {
        return DonneesApp.transactionsFonds.filter(t => t.type === type);
    },

    /**
     * Obtenir les transactions liées à un paiement
     */
    obtenirTransactionsPaiement(idPaiement) {
        return DonneesApp.transactionsFonds.filter(t => 
            t.typeReference === 'payment' && t.idReference === idPaiement
        );
    },

    /**
     * Obtenir les transactions liées à une dépense
     */
    obtenirTransactionsDepense(idDepense) {
        return DonneesApp.transactionsFonds.filter(t => 
            t.typeReference === 'expense' && t.idReference === idDepense
        );
    },

    /**
     * Annuler une transaction
     */
    annulerTransaction(idTransaction, raison) {
        const transaction = SelecteursDonnees.obtenirTransactionParId(idTransaction);
        if (!transaction) {
            return {
                success: false,
                erreurs: ['المعاملة غير موجودة']
            };
        }

        // Créer la transaction d'annulation
        const transactionAnnulation = {
            id: (DonneesApp.transactionsFonds?.length || 0) + 1,
            type: transaction.type === TypesTransaction.DEPOT ? TypesTransaction.RETRAIT : TypesTransaction.DEPOT,
            categorie: 'reversal',
            montant: transaction.montant,
            description: `إلغاء معاملة #${idTransaction} - ${raison}`,
            date: new Date().toLocaleDateString('ar-MA'),
            dateIso: new Date().toISOString(),
            typeReference: 'transaction',
            idReference: idTransaction,
            statut: StatutTransaction.COMPLETE,
            creeLe: new Date().toISOString(),
            misAJourLe: new Date().toISOString(),
            metadata: {
                idTransactionOriginale: idTransaction,
                raisonAnnulation: raison
            }
        };

        // Mettre à jour le statut de la transaction originale
        transaction.statut = StatutTransaction.ANNULE;
        transaction.misAJourLe = new Date().toISOString();

        // Ajouter la transaction d'annulation
        if (!DonneesApp.transactionsFonds) {
            DonneesApp.transactionsFonds = [];
        }
        DonneesApp.transactionsFonds.push(transactionAnnulation);

        // Mettre à jour le statut du paiement ou de la dépense lié
        if (transaction.typeReference === 'payment') {
            const paiement = DonneesApp.paiements.find(p => p.id === transaction.idReference);
            if (paiement) {
                paiement.statut = StatutTransaction.ANNULE;
                paiement.misAJourLe = new Date().toISOString();
            }
        } else if (transaction.typeReference === 'expense') {
            const depense = DonneesApp.depenses.find(e => e.id === transaction.idReference);
            if (depense) {
                depense.statut = StatutTransaction.ANNULE;
                depense.misAJourLe = new Date().toISOString();
            }
        }

        return {
            success: true,
            transactionAnnulation,
            transactionOriginale: transaction
        };
    }
};
