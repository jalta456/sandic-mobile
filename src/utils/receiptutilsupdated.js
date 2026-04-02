/**
 * src/utils/receiptUtils.js
 * Utilitaires de génération de reçus de paiement.
 */

window.UtilitairesRecus = {
    /**
     * Générer le HTML du reçu
     */
    genererHTMLRecu(paiement) {
        const nomProprietaire = SelecteursDonnees.obtenirNomProprietaire(paiement.idProprietaire);
        const transaction = SelecteursDonnees.obtenirTransactionParId(paiement.idTransaction);
        const dateActuelle = new Date().toLocaleDateString('ar-MA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let htmlRecu = `
            <div class="receipt-container" style="
                max-width: 400px;
                margin: 20px auto;
                padding: 20px;
                border: 2px solid #333;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                direction: rtl;
                text-align: center;
            ">
                <div style="border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 15px;">
                    <h2 style="margin: 0; color: #333;">وصل دفع - السانديك</h2>
                    <p style="margin: 5px 0; color: #666;">المجمع السكني</p>
                </div>

                <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0; color: #666;">رقم الوصل: #${paiement.id}</p>
                    <p style="margin: 5px 0; color: #666;">التاريخ: ${dateActuelle}</p>
                    ${transaction ? `<p style="margin: 5px 0; color: #666;">رقم المعاملة: #${transaction.id}</p>` : ''}
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <p style="margin: 5px 0; font-size: 1.2rem; font-weight: bold; color: #333;">
                        ${paiement.montant.toLocaleString()} درهم
                    </p>
                    <p style="margin: 5px 0; color: #666;">واجب ${paiement.mois} ${paiement.annee}</p>
                    ${transaction ? `
                    <p style="margin: 5px 0; color: ${transaction.statut === 'completed' ? '#28a745' : '#ffc107'};">
                        الحالة: ${transaction.statut === 'completed' ? 'مكتملة' : 'قيد المعالجة'}
                    </p>` : ''}
                </div>

                <div style="text-align: right; margin-bottom: 15px;">
                    <p style="margin: 5px 0; color: #333;"><strong>المالك:</strong> ${nomProprietaire}</p>
                    <p style="margin: 5px 0; color: #666;">الشقة: ${DonneesApp.proprietaires.find(o => o.id === paiement.idProprietaire)?.appartement || '-'}</p>
                </div>

                ${paiement.notes ? `
                <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <p style="margin: 0; color: #856404;"><strong>ملاحظات:</strong> ${paiement.notes}</p>
                </div>
                ` : ''}

                <div style="border-top: 2px dashed #333; padding-top: 15px;">
                    <p style="margin: 0; color: #666;">شكراً لتعاونكم!</p>
                </div>
            </div>
        `;

        return htmlRecu;
    },

    /**
     * Imprimer le reçu
     */
    imprimerRecu(paiement) {
        const htmlRecu = this.genererHTMLRecu(paiement);
        const fenetreImpression = window.open('', '_blank');
        fenetreImpression.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>وصل دفع - السانديك</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .receipt-container { border: none !important; }
                    }
                </style>
            </head>
            <body>
                ${htmlRecu}
            </body>
            </html>
        `);
        fenetreImpression.document.close();
        fenetreImpression.print();
    },

    /**
     * Télécharger le reçu en PDF (nécessite la bibliothèque html2pdf)
     */
    telechargerPDFRecu(paiement) {
        if (typeof html2pdf === 'undefined') {
            alert('مكتبة html2pdf غير متوفرة. يرجى تحميلها من: https://cdnjs.cloudflare.com/libraries/html2pdf.js');
            return;
        }

        const htmlRecu = this.genererHTMLRecu(paiement);
        const element = document.createElement('div');
        element.innerHTML = htmlRecu;
        document.body.appendChild(element);

        const options = {
            margin: 10,
            filename: `recu_${paiement.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save().then(() => {
            document.body.removeChild(element);
        });
    },

    /**
     * Partager le reçu via WhatsApp
     */
    partagerRecuWhatsApp(paiement, tel) {
        if (!tel) {
            return {
                success: false,
                erreurs: ['رقم الهاتف مطلوب']
            };
        }

        // Valider le numéro de téléphone
        const validation = ValidateurTelephone.validerTelephone(tel);
        if (!validation.estValide) {
            return {
                success: false,
                erreurs: [validation.erreur]
            };
        }

        const message = UtilitairesWhatsApp.genererRecu(paiement);
        UtilitairesWhatsApp.ouvrirWhatsApp(tel, message);

        return {
            success: true,
            message,
            validationTelephone: validation
        };
    },

    /**
     * Générer un reçu détaillé avec les détails de la transaction
     */
    genererRecuDetaille(paiement) {
        const nomProprietaire = SelecteursDonnees.obtenirNomProprietaire(paiement.idProprietaire);
        const transaction = SelecteursDonnees.obtenirTransactionParId(paiement.idTransaction);
        const proprietaire = DonneesApp.proprietaires.find(o => o.id === paiement.idProprietaire);

        let recu = {
            paiement: {
                id: paiement.id,
                montant: paiement.montant,
                mois: paiement.mois,
                annee: paiement.annee,
                date: paiement.date,
                notes: paiement.notes,
                statut: paiement.statut
            },
            proprietaire: {
                id: proprietaire.id,
                nom: nomProprietaire,
                appartement: proprietaire.appartement,
                telephone: proprietaire.telephone
            },
            transaction: transaction ? {
                id: transaction.id,
                type: transaction.type,
                categorie: transaction.categorie,
                statut: transaction.statut,
                creeLe: transaction.creeLe,
                metadata: transaction.metadata
            } : null
        };

        return recu;
    }
};
