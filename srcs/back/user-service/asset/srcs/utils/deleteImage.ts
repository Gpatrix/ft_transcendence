async function deleteImage(imageName: string): Promise<void> {
    await fetch(`http:/upload-service:3000/api/upload/${imageName}`, {
        method: 'DELETE',
        body: JSON.stringify({ credential: process.env.API_CREDENTIAL }),
        headers: { 'Content-Type': 'application/json' }      
    });
    return ;
}

module.exports = deleteImage;