/**
 * src/utils/whatsappUtils.js
 * Utilitaires d'intégration WhatsApp pour les rapports financiers et les rappels.
 */

window.UtilitairesWhatsApp = {
    /**
     * Générer le message du rapport financier mensuel
     */
    genererRapportMensuel() {
        const solde = SelecteursDonnees.obtenirSolde();
        const totalCollectes = SelecteursDonnees.obtenirTotalCollectes('month');
        const totalDepenses = SelecteursDonnees.obtenirTotalDepenses('month');
        const donneesRetards = SelecteursDonnees.obtenirDetailImpayes();

        // Obtenir le résumé des fonds
        const resumeFonds = UtilitairesFonds.obtenirResumeFonds();

        return `📊 *تقرير مالي شهري - المجمع السكني*

💰 *الرصيد الحالي:* ${solde.toLocaleString()} درهم

💵 *المداخيل الشهرية:* ${totalCollectes.toLocaleString()} درهم
📤 *المصاريف الشهرية:* ${totalDepenses.toLocaleString()} درهم

📊 *ملخص الصندوق:*
💰 إجمالي الإيداعات: ${resumeFonds.totalDepots.toLocaleString()} درهم
📤 إجمالي السحوبات: ${resumeFonds.totalRetraits.toLocaleString()} درهم
📈 عدد المعاملات: ${resumeFonds.nbTransactions}

⚠️ *المتأخرات:*
📌 عدد الملاك المتأخرين: ${donneesRetards.nb}
💵 المبلغ الإجمالي: ${donneesRetards.montantTotal.toLocaleString()} درهم

📅 *التاريخ:* ${new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}

_للمزيد من التفاصيل يرجى مراجعة التطبيق_`;
    },

    /**
     * Générer le message de rappel de paiement pour un propriétaire spécifique
     */
    genererRappelPaiement(proprietaire, moisRetard, totalDu) {
        return `🔔 *تذكير بأداء السانديك*

السلام عليكم ورحمة الله،

نود تذكيركم بأداء واجب السانديك للمجمع السكني:

👤 *المالك:* ${proprietaire.nom}
🏢 *الشقة:* ${proprietaire.appartement}
💵 *المبلغ المستحق:* ${totalDu.toLocaleString()} درهم
📅 *الأشهر المتأخرة:* ${moisRetard.join('، ')}

يرجى التكرم بأداء المبلغ في أقرب وقت ممكن.
شكراً لتعاونكم! 🙏`;
    },

    /**
     * Générer le message du reçu de paiement
     */
    genererRecu(paiement) {
        const nomProprietaire = SelecteursDonnees.obtenirNomProprietaire(paiement.idProprietaire);
        const transaction = SelecteursDonnees.obtenirTransactionParId(paiement.idTransaction);

        let recu = `🧾 *وصل دفع - السانديك*

✅ *تم استلام الدفعة بنجاح*

👤 *المالك:* ${nomProprietaire}
💵 *المبلغ:* ${paiement.montant.toLocaleString()} درهم
📅 *لشهر:* ${paiement.mois} ${paiement.annee}
📝 *ملاحظات:* ${paiement.notes || 'لا يوجد'}

📅 *تاريخ الدفع:* ${paiement.date}`;

        if (transaction) {
            recu += `

📋 *رقم المعاملة:* #${transaction.id}
📊 *حالة المعاملة:* ${transaction.statut === 'completed' ? 'مكتملة' : 'قيد المعالجة'}`;
        }

        recu += `

_شكراً لتعاونكم!_ 🙏`;

        return recu;
    },

    /**
     * Générer le message de transaction de fonds
     */
    genererTransactionFonds(transaction) {
        const typeTransaction = transaction.type === 'deposit' ? 'إيداع' : 'سحب';
        const iconeType = transaction.type === 'deposit' ? '💰' : '📤';

        let message = `${iconeType} *عملية صندوق*

${typeTransaction === 'إيداع' ? 'تم إيداع مبلغ' : 'تم سحب مبلغ'} ${transaction.montant.toLocaleString()} درهم من صندوق المجمع.

📝 *الوصف:* ${transaction.description || 'لا يوجد'}
📅 *التاريخ:* ${transaction.date}`;

        // Ajouter les informations de référence si disponibles
        if (transaction.typeReference && transaction.idReference) {
            const typeRef = transaction.typeReference === 'payment' ? 'دفع' : 'مصروف';
            message += `
📋 *المرجع:* ${typeRef} #${transaction.idReference}`;
        }

        // Ajouter les métadonnées si disponibles
        if (transaction.metadata) {
            if (transaction.metadata.idProprietaire) {
                const proprietaire = SelecteursDonnees.obtenirNomProprietaire(transaction.metadata.idProprietaire);
                message += `
👤 *المالك:* ${proprietaire}`;
            }
            if (transaction.metadata.mois && transaction.metadata.annee) {
                message += `
📅 *الشهر:* ${transaction.metadata.mois} ${transaction.metadata.annee}`;
            }
        }

        message += `

_الرصيد الحالي للصندوق:_ ${SelecteursDonnees.obtenirSolde().toLocaleString()} درهم`;

        return message;
    },

    /**
     * Ouvrir WhatsApp avec un message
     */
    ouvrirWhatsApp(tel, message) {
        if (!tel) {
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            return;
        }

        // Valider et formater le numéro de téléphone
        const validation = ValidateurTelephone.validerTelephone(tel);
        if (!validation.estValide) {
            return alert(validation.erreur);
        }

        const telFormate = validation.formate;

        // Ouvrir WhatsApp avec le numéro formaté
        const url = `https://wa.me/${telFormate}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    },

    /**
     * Valider le numéro de téléphone
     */
    validerTelephone(tel) {
        const validation = ValidateurTelephone.validerTelephone(tel);
        return validation.estValide;
    },

    /**
     * Obtenir le nom du pays à partir du numéro de téléphone
     */
    obtenirPaysTelephone(tel) {
        return ValidateurTelephone.obtenirNomPays(tel);
    }
};
