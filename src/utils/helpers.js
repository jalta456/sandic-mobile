/**
 * src/utils/helpers.js
 * Utilitaires d'aide pour le formatage, la validation et la gestion des doublons.
 */

window.Aides = {
    formaterDevise(montant) {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(montant).replace('MAD', 'درهم');
    },

    formaterDate(dateStr) {
        return dateStr; // Simple pour l'instant
    }
};

// Constantes de type de transaction
window.TypesTransaction = {
    DEPOT: 'deposit',
    RETRAIT: 'withdrawal'
};

// Constantes de catégorie de transaction
window.CategoriesTransaction = {
    PAIEMENT: 'payment',
    DEPENSE: 'expense',
    DEPOT: 'deposit',
    RETRAIT: 'withdrawal'
};

// Constantes de statut de transaction
window.StatutTransaction = {
    EN_ATTENTE: 'pending',
    COMPLETE: 'completed',
    ANNULE: 'cancelled'
};

// Validateur de Transaction
window.ValidateurTransaction = {
    validerTransaction(transaction) {
        const erreurs = [];

        // Valider le montant
        if (!transaction.montant || transaction.montant <= 0) {
            erreurs.push('المبلغ يجب أن يكون أكبر من صفر');
        }

        // Valider le type
        if (!Object.values(TypesTransaction).includes(transaction.type)) {
            erreurs.push('نوع المعاملة غير صالح');
        }

        // Valider la catégorie
        if (!Object.values(CategoriesTransaction).includes(transaction.categorie)) {
            erreurs.push('فئة المعاملة غير صالحة');
        }

        // Valider la date
        if (!transaction.dateIso || isNaN(new Date(transaction.dateIso))) {
            erreurs.push('تاريخ المعاملة غير صالح');
        }

        // Valider le statut
        if (!Object.values(StatutTransaction).includes(transaction.statut)) {
            erreurs.push('حالة المعاملة غير صالحة');
        }

        // Valider le solde pour les retraits
        if (transaction.type === TypesTransaction.RETRAIT) {
            const soldeActuel = SelecteursDonnees.obtenirSoldeFonds();
            if (transaction.montant > soldeActuel) {
                erreurs.push(`الرصيد غير كافٍ. الرصيد الحالي: ${soldeActuel} درهم`);
            }
        }

        // Valider la référence pour les paiements
        if (transaction.categorie === CategoriesTransaction.PAIEMENT && !transaction.idReference) {
            erreurs.push('معاملة الدفع يجب أن تكون مرتبطة بدفع');
        }

        // Valider la référence pour les dépenses
        if (transaction.categorie === CategoriesTransaction.DEPENSE && !transaction.idReference) {
            erreurs.push('معاملة المصروف يجب أن تكون مرتبطة بمصروف');
        }

        return {
            estValide: erreurs.length === 0,
            erreurs
        };
    },

    validerPaiement(paiement) {
        const erreurs = [];

        // Valider le propriétaire
        if (!paiement.idProprietaire) {
            erreurs.push('معرف المالك مطلوب');
        }

        // Valider le montant
        if (!paiement.montant || paiement.montant <= 0) {
            erreurs.push('المبلغ يجب أن يكون أكبر من صفر');
        }

        // Valider le mois et l'année
        if (!paiement.mois || !paiement.annee) {
            erreurs.push('الشهر والسنة مطلوبان');
        }

        // Valider le statut
        if (!Object.values(StatutTransaction).includes(paiement.statut)) {
            erreurs.push('حالة الدفع غير صالحة');
        }

        // Vérifier les doublons de paiement
        const paiementExistant = DonneesApp.paiements.find(p => 
            p.idProprietaire === paiement.idProprietaire &&
            p.mois === paiement.mois &&
            p.annee === paiement.annee &&
            p.statut === StatutTransaction.COMPLETE
        );

        if (paiementExistant) {
            erreurs.push('يوجد دفع مسجل لهذا الشهر والسنة');
        }

        return {
            estValide: erreurs.length === 0,
            erreurs
        };
    },

    validerDepense(depense) {
        const erreurs = [];

        // Valider le titre
        if (!depense.titre || depense.titre.trim() === '') {
            erreurs.push('عنوان المصروف مطلوب');
        }

        // Valider la catégorie
        if (!depense.categorie || depense.categorie.trim() === '') {
            erreurs.push('فئة المصروف مطلوبة');
        }

        // Valider le montant
        if (!depense.montant || depense.montant <= 0) {
            erreurs.push('المبلغ يجب أن يكون أكبر من صفر');
        }

        // Valider le statut
        if (!Object.values(StatutTransaction).includes(depense.statut)) {
            erreurs.push('حالة المصروف غير صالحة');
        }

        return {
            estValide: erreurs.length === 0,
            erreurs
        };
    }
};

// Vérificateur de Doublons
window.VerificateurDoublons = {
    verifierDoublonTransaction(transaction) {
        const transactions = DonneesApp.transactionsFonds || [];

        const doublon = transactions.find(t => 
            t.type === transaction.type &&
            t.categorie === transaction.categorie &&
            t.montant === transaction.montant &&
            new Date(t.dateIso).toDateString() === new Date(transaction.dateIso).toDateString() &&
            (transaction.idReference ? t.idReference === transaction.idReference : true) &&
            t.statut !== StatutTransaction.ANNULE
        );

        return !!doublon;
    },

    verifierDoublonPaiement(paiement) {
        const paiements = DonneesApp.paiements || [];

        const doublon = paiements.find(p => 
            p.idProprietaire === paiement.idProprietaire &&
            p.mois === paiement.mois &&
            p.annee === paiement.annee &&
            p.statut === StatutTransaction.COMPLETE
        );

        return !!doublon;
    },

    genererHashTransaction(transaction) {
        const donnees = `${transaction.type}|${transaction.categorie}|${transaction.montant}|${transaction.dateIso}|${transaction.idReference || ''}`;
        return btoa(donnees).substring(0, 16);
    }
};

// Validateur de Téléphone
window.ValidateurTelephone = {
    validerTelephone(tel) {
        if (!tel || typeof tel !== 'string') {
            return {
                estValide: false,
                erreur: 'رقم الهاتف مطلوب'
            };
        }

        const telNettoye = tel.replace(/\D/g, '');

        if (telNettoye.length < 8 || telNettoye.length > 15) {
            return {
                estValide: false,
                erreur: 'رقم الهاتف يجب أن يكون بين 8 و 15 رقم'
            };
        }

        const motifsPays = {
            'MA': /^(06|07)[0-9]{8}$/,
            'DZ': /^(05|06|07)[0-9]{8}$/,
            'TN': /^(02|04|09|71|20|21|22|23|25|27|28|29|31|33|36|38|39|40|41|42|43|44|45|46|47|48|49|50|52|53|55|56|58|59|90|91|92|93|94|95|96|97|98|99)[0-9]{7}$/,
            'EG': /^(01|02|010|011|012)[0-9]{8}$/,
            'SA': /^05[0-9]{8}$/,
            'AE': /^05[0-9]{9}$/,
            'QA': /^(3|6|7)[0-9]{7}$/,
            'KW': /^(5|6|9)[0-9]{8}$/,
            'BH': /^(3|6)[0-9]{8}$/,
            'OM': /^9[0-9]{8}$/,
            'JO': /^(07|078|079)[0-9]{7}$/,
            'LB': /^(01|03|70|71|76|78|79|81)[0-9]{6}$/,
            'SY': /^09[0-9]{8}$/,
            'IQ': /^07[0-9]{9}$/,
            'YE': /^(01|07)[0-9]{8}$/,
            'LY': /^09[0-9]{8}$/,
            'SD': /^(01|09)[0-9]{8}$/,
            'MR': /^(2|3|4)[0-9]{7}$/,
            'INT': /^[0-9]{8,15}$/
        };

        for (const [pays, motif] of Object.entries(motifsPays)) {
            if (motif.test(telNettoye)) {
                return {
                    estValide: true,
                    pays,
                    telNettoye,
                    formate: this.formaterTelephone(telNettoye, pays)
                };
            }
        }

        if (motifsPays['INT'].test(telNettoye)) {
            return {
                estValide: true,
                pays: 'INT',
                telNettoye,
                formate: this.formaterTelephone(telNettoye, 'INT')
            };
        }

        return {
            estValide: false,
            erreur: 'رقم الهاتف غير صحيح'
        };
    },

    formaterTelephone(tel, pays) {
        const telNettoye = tel.replace(/\D/g, '');
        const codesPays = {
            'MA': '212', 'DZ': '213', 'TN': '216', 'EG': '20', 'SA': '966', 'AE': '971',
            'QA': '974', 'KW': '965', 'BH': '973', 'OM': '968', 'JO': '962', 'LB': '961',
            'SY': '963', 'IQ': '964', 'YE': '967', 'LY': '218', 'SD': '249', 'MR': '222'
        };

        if (pays === 'MA' && telNettoye.startsWith('0')) return codesPays[pays] + telNettoye.substring(1);
        if (pays === 'DZ' && telNettoye.startsWith('0')) return codesPays[pays] + telNettoye.substring(1);
        if (pays === 'TN' && !telNettoye.startsWith('216')) return codesPays[pays] + telNettoye;
        if (pays === 'EG') return (telNettoye.startsWith('0') ? codesPays[pays] + telNettoye.substring(1) : codesPays[pays] + telNettoye);
        if (pays === 'SA' && telNettoye.startsWith('0')) return codesPays[pays] + telNettoye.substring(1);
        if (pays === 'AE' && telNettoye.startsWith('0')) return codesPays[pays] + telNettoye.substring(1);
        if (pays === 'QA' && !telNettoye.startsWith('974')) return codesPays[pays] + telNettoye;
        if (pays === 'KW' && !telNettoye.startsWith('965')) return codesPays[pays] + telNettoye;
        if (pays === 'BH' && !telNettoye.startsWith('973')) return codesPays[pays] + telNettoye;
        if (pays === 'OM' && !telNettoye.startsWith('968')) return codesPays[pays] + telNettoye;
        if (pays === 'JO' && !telNettoye.startsWith('962')) return codesPays[pays] + telNettoye;
        if (pays === 'LB' && !telNettoye.startsWith('961')) return codesPays[pays] + telNettoye;
        if (pays === 'SY' && !telNettoye.startsWith('963')) return codesPays[pays] + telNettoye;
        if (pays === 'IQ' && !telNettoye.startsWith('964')) return codesPays[pays] + telNettoye;
        if (pays === 'YE' && !telNettoye.startsWith('967')) return codesPays[pays] + telNettoye;
        if (pays === 'LY' && !telNettoye.startsWith('218')) return codesPays[pays] + telNettoye;
        if (pays === 'SD' && !telNettoye.startsWith('249')) return codesPays[pays] + telNettoye;
        if (pays === 'MR' && !telNettoye.startsWith('222')) return codesPays[pays] + telNettoye;

        return telNettoye;
    },

    obtenirNomPays(tel) {
        const validation = this.validerTelephone(tel);
        if (!validation.estValide) return null;

        const nomsPays = {
            'MA': 'المغرب', 'DZ': 'الجزائر', 'TN': 'تونس', 'EG': 'مصر', 'SA': 'السعودية',
            'AE': 'الإمارات', 'QA': 'قطر', 'KW': 'الكويت', 'BH': 'البحرين', 'OM': 'عمان',
            'JO': 'الأردن', 'LB': 'لبنان', 'SY': 'سوريا', 'IQ': 'العراق', 'YE': 'اليمن',
            'LY': 'ليبيا', 'SD': 'السودان', 'MR': 'موريتانيا', 'INT': 'دولي'
        };

        return nomsPays[validation.pays] || 'غير معروف';
    }
};
