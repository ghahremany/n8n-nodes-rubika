import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class RubikaWebhook implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Rubika Webhook',
		name: 'rubikaWebhook',
		icon: 'file:rubika.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Rubika sends a webhook',
		defaults: {
			name: 'Rubika Webhook',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Webhook Type',
				name: 'webhookType',
				type: 'options',
				options: [
					{
						name: 'Both (Update & Inline Message)',
						value: 'both',
						description: 'Receive both regular updates and inline messages',
					},
					{
						name: 'Update Only',
						value: 'update',
						description: 'Receive only regular updates (receiveUpdate)',
					},
					{
						name: 'Inline Message Only',
						value: 'inline',
						description: 'Receive only inline messages (receiveInlineMessage)',
					},
				],
				default: 'both',
				description: 'Type of webhook events to process',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const webhookType = this.getNodeParameter('webhookType') as string;

		// Check if this is a receiveUpdate or receiveInlineMessage
		const isUpdate = bodyData.hasOwnProperty('update');
		const isInlineMessage = bodyData.hasOwnProperty('inline_message');

		// Filter based on webhook type setting
		if (webhookType === 'update' && !isUpdate) {
			return {
				noWebhookResponse: true,
			};
		}
		
		if (webhookType === 'inline' && !isInlineMessage) {
			return {
				noWebhookResponse: true,
			};
		}

		let processedData: any = {};

		if (isUpdate) {
			// Process receiveInlineMessage format
			const update = bodyData.update as any;
			processedData = {
				type: 'update',
				updateType: update.type,
				chatId: update.chat_id,
				messageId: update.new_message?.message_id,
				text: update.new_message?.text,
				time: update.new_message?.time,
				isEdited: update.new_message?.is_edited,
				senderType: update.new_message?.sender_type,
				senderId: update.new_message?.sender_id,
				buttonId: update.new_message?.aux_data?.button_id,
				startId: update.new_message?.aux_data?.start_id,
				rawData: bodyData,
			};
		}

		if (isInlineMessage) {
			// Process receiveUpdate format
			const inlineMessage = bodyData.inline_message as any;
			processedData = {
				type: 'inline_message',
				chatId: inlineMessage.chat_id,
				messageId: inlineMessage.message_id,
				text: inlineMessage.text,
				senderId: inlineMessage.sender_id,
				location: inlineMessage.location,
				buttonId: inlineMessage.aux_data?.button_id,
				startId: inlineMessage.aux_data?.start_id,
				rawData: bodyData,
			};
		}

		return {
			workflowData: [
				[
					{
						json: processedData,
					},
				],
			],
		};
	}
}
