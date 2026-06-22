import { delay } from "../utils/delay";

export async function AddData<T>(url: string, data: T) {
    try {
        await delay(2000);
        const promise = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json'
            }
        })
        if (promise.ok) console.log('data added successfully')
        else throw new Error('Error adding data')
    } catch (error) {
        console.error(error)
        // throw error
    }
}


