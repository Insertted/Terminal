export async function sendNotification(message) {
    const token = '8655433351:AAEUrb37jTAGsdIO5x3T1IEqSb-ljERzruc'; 
    const chatId = '1178017376';
    
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.ok) {
            console.log('TG: Message sent');
        } else {
            console.error('TG Error:', data.description);
        }
    } catch (e) {
        console.error('TG: Error connection');
    }
}