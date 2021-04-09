const express = require('express');
const cors = require('cors');

const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const app = express();

app.use(cors({
    origin: true
}));

app.use(express.json());

app.post('/messages', async (request, response) => {
    try {
        const data = request.body;
    
        const writeResult = await admin.firestore().collection('messages').add({
            original: data.text
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

app.get('/messages/:id', async (request, response) => {
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

app.get('/messages', async (request, response) => {
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

app.delete('/messages',async (request, response) => {
    try {
        const data = request.body;
        const documentId = data.id;
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

exports.app = functions.https.onRequest(app);