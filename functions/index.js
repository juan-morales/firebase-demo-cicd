const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    try {
        const original = request.query.text;
    
        const writeResult = await admin.firestore().collection('messages').add({
            original: original
        });
    
        return response.json({
            result: `Message with ID [${writeResult.id}] added`
        });
    } catch (error) {
        return response.json({
            error: JSON.stringify(error)
        });
    }
});

exports.getMessage = functions.https.onRequest(async (request, response) => {
    try {
        const documentId = request.query.id; 
        const documentRef = await admin.firestore().collection('messages').doc(documentId);
        const documentSnapshot = await documentRef.get();
        const documentData = documentSnapshot.data();

        return response.json({
            data: documentData
        })
    } catch (error) {
        return response.json({
            error: JSON.stringify(error)
        })
    }
});

exports.listMessages = functions.https.onRequest(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    try {
        const fnGetAllMessages = async () => {
            const resultsRef = await admin.firestore().collection('messages').get();
            let results = resultsRef.docs.map(doc => {
                return {
                    id: doc.id,
                    data: doc.data()
                }                
            });

            return results;
        };

        let results = await fnGetAllMessages();

        return response.json({
            data: results
        })
    } catch (error) {
        return response.json({
            error: JSON.stringify(error)
        })
    }
});

exports.deleteMessage = functions.https.onRequest(async (request, response) => {
    try {
        const documentId = request.query.id;
        const documentRef = await admin.firestore().collection('messages').doc(documentId).delete();
        
        return response.json({
            result: `Document ${documentId} is deleted`
        })
    } catch (error) {
        return response.json({
            error: JSON.stringify(error)
        })
    }
});

exports.makeUpperCase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snapshot, context) => {
        const original = snapshot.data().original;
        
        functions.logger.log('Uppercasing', context.params.documentId, original);
        
        const uppercase = original.toUpperCase();

        return snapshot.ref.set({
            uppercase
        }, {merge: true});
    });