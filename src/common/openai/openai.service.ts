import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenAI } from 'openai'

@Injectable()
export class OpenAiService {
    private openai: OpenAI

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('GITHUB_ACCESS_KEY'),
            baseURL: 'https://models.inference.ai.azure.com'
        })
    }

    async askChatGPT(prompt: string): Promise<string | undefined> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: 'Can you make suggestions for this todo (keep it short): ' + prompt
                    }
                ]
            })

            return response.choices[0]?.message?.content || 'No Response From GPT.'
        } catch (error) {
            console.error('ChatGPT Error:', error)
            return undefined
        }
    }
}
