export default function generateRandomVerificationCode(): string {
    const randomNumber: number = Math.floor(Math.random() * 10000)

    const formattedNumber: string = randomNumber.toString().padStart(4, '0')

    return formattedNumber
}
