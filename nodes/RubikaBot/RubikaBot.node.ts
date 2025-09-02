import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class RubikaBot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Rubika Bot',
		name: 'rubikaBot',
		icon: 'file:rubika.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Send messages and interact with Rubika Bot API',
		defaults: {
			name: 'Rubika Bot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'rubikaBot',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a text message',
						action: 'Send a message',
					},
					{
						name: 'Send Photo',
						value: 'sendPhoto',
						description: 'Send a photo',
						action: 'Send a photo',
					},
					{
						name: 'Send Audio',
						value: 'sendAudio',
						description: 'Send an audio file',
						action: 'Send an audio file',
					},
					{
						name: 'Send Video',
						value: 'sendVideo',
						description: 'Send a video file',
						action: 'Send a video file',
					},
					{
						name: 'Send Document',
						value: 'sendDocument',
						description: 'Send a document',
						action: 'Send a document',
					},
					{
						name: 'Send Location',
						value: 'sendLocation',
						description: 'Send a location',
						action: 'Send a location',
					},
					{
						name: 'Send Contact',
						value: 'sendContact',
						description: 'Send a contact',
						action: 'Send a contact',
					},
					{
						name: 'Edit Message',
						value: 'editMessage',
						description: 'Edit an existing message',
						action: 'Edit a message',
					},
					{
						name: 'Delete Message',
						value: 'deleteMessage',
						description: 'Delete a message',
						action: 'Delete a message',
					},
					{
						name: 'Get File',
						value: 'getFile',
						description: 'Get file information',
						action: 'Get file information',
					},
					{
						name: 'Get Me',
						value: 'getMe',
						description: 'Get bot information',
						action: 'Get bot information',
					},
				],
				default: 'sendMessage',
			},
			// Chat ID
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
							'sendPhoto',
							'sendAudio',
							'sendVideo',
							'sendDocument',
							'sendLocation',
							'sendContact',
							'editMessage',
							'deleteMessage',
						],
					},
				},
				default: '',
				placeholder: 'b0QFtn0C1I022abcd29f1d60c9ce5b08',
				description: 'Chat ID where to send the message',
			},
			// Text message
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendMessage', 'editMessage'],
					},
				},
				default: '',
				description: 'Text of the message to send',
			},
			// Message ID for edit/delete
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['editMessage', 'deleteMessage'],
					},
				},
				default: '',
				description: 'ID of the message to edit or delete',
			},
			// File ID
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendPhoto', 'sendAudio', 'sendVideo', 'sendDocument', 'getFile'],
					},
				},
				default: '',
				description: 'File ID to send or get information about',
			},
			// Caption
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendPhoto', 'sendAudio', 'sendVideo', 'sendDocument'],
					},
				},
				default: '',
				description: 'Caption for the media file',
			},
			// Location coordinates
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['sendLocation'],
					},
				},
				default: 0,
				description: 'Latitude of the location',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['sendLocation'],
					},
				},
				default: 0,
				description: 'Longitude of the location',
			},
			// Contact information
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendContact'],
					},
				},
				default: '',
				description: 'Contact phone number',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendContact'],
					},
				},
				default: '',
				description: 'Contact first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['sendContact'],
					},
				},
				default: '',
				description: 'Contact last name',
			},
			// Inline Keyboard
			{
				displayName: 'Add Keyboard',
				name: 'addKeyboard',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['sendMessage', 'sendPhoto', 'sendAudio', 'sendVideo', 'sendDocument'],
					},
				},
				default: false,
				description: 'Whether to add an inline keyboard',
			},
			{
				displayName: 'Keyboard',
				name: 'keyboard',
				placeholder: 'Add Keyboard Button',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						operation: ['sendMessage', 'sendPhoto', 'sendAudio', 'sendVideo', 'sendDocument'],
						addKeyboard: [true],
					},
				},
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'keyboard',
						displayName: 'Keyboard',
						values: [
							{
								displayName: 'Button Text',
								name: 'text',
								type: 'string',
								default: '',
								description: 'Text to display on the button',
							},
							{
								displayName: 'Button ID',
								name: 'buttonId',
								type: 'string',
								default: '',
								description: 'Unique ID for the button',
							},
							{
								displayName: 'Button Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'Regular',
										value: 'regular',
									},
									{
										name: 'URL',
										value: 'url',
									},
									{
										name: 'Callback',
										value: 'callback',
									},
								],
								default: 'regular',
								description: 'Type of the button',
							},
							{
								displayName: 'URL',
								name: 'url',
								type: 'string',
								displayOptions: {
									show: {
										type: ['url'],
									},
								},
								default: '',
								description: 'URL to open when button is clicked',
							},
						],
					},
				],
			},
			// Additional options
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Disable Notification',
						name: 'disableNotification',
						type: 'boolean',
						default: false,
						description: 'Sends the message silently',
					},
					{
						displayName: 'Reply to Message ID',
						name: 'replyToMessageId',
						type: 'string',
						default: '',
						description: 'If the message is a reply, ID of the original message',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('rubikaBot');

		const token = credentials.token as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				
				let endpoint = '';
				let body: any = {};

				switch (operation) {
					case 'sendMessage':
						endpoint = 'sendMessage';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							text: this.getNodeParameter('text', i),
						};
						break;

					case 'sendPhoto':
						endpoint = 'sendPhoto';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							photo: this.getNodeParameter('fileId', i),
							caption: this.getNodeParameter('caption', i, ''),
						};
						break;

					case 'sendAudio':
						endpoint = 'sendAudio';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							audio: this.getNodeParameter('fileId', i),
							caption: this.getNodeParameter('caption', i, ''),
						};
						break;

					case 'sendVideo':
						endpoint = 'sendVideo';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							video: this.getNodeParameter('fileId', i),
							caption: this.getNodeParameter('caption', i, ''),
						};
						break;

					case 'sendDocument':
						endpoint = 'sendDocument';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							document: this.getNodeParameter('fileId', i),
							caption: this.getNodeParameter('caption', i, ''),
						};
						break;

					case 'sendLocation':
						endpoint = 'sendLocation';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							latitude: this.getNodeParameter('latitude', i),
							longitude: this.getNodeParameter('longitude', i),
						};
						break;

					case 'sendContact':
						endpoint = 'sendContact';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							phone_number: this.getNodeParameter('phoneNumber', i),
							first_name: this.getNodeParameter('firstName', i),
							last_name: this.getNodeParameter('lastName', i, ''),
						};
						break;

					case 'editMessage':
						endpoint = 'editMessageText';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							message_id: this.getNodeParameter('messageId', i),
							text: this.getNodeParameter('text', i),
						};
						break;

					case 'deleteMessage':
						endpoint = 'deleteMessage';
						body = {
							chat_id: this.getNodeParameter('chatId', i),
							message_id: this.getNodeParameter('messageId', i),
						};
						break;

					case 'getFile':
						endpoint = 'getFile';
						body = {
							file_id: this.getNodeParameter('fileId', i),
						};
						break;

					case 'getMe':
						endpoint = 'getMe';
						body = {};
						break;

					default:
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
				}

				// Add keyboard if specified
				const addKeyboard = this.getNodeParameter('addKeyboard', i, false) as boolean;
				if (addKeyboard && ['sendMessage', 'sendPhoto', 'sendAudio', 'sendVideo', 'sendDocument'].includes(operation)) {
					const keyboardData = this.getNodeParameter('keyboard', i, {}) as any;
					if (keyboardData.keyboard && keyboardData.keyboard.length > 0) {
						const inlineKeyboard = keyboardData.keyboard.map((button: any) => ({
							text: button.text,
							button_id: button.buttonId,
							type: button.type || 'regular',
							...(button.url && { url: button.url }),
						}));
						body.reply_markup = {
							inline_keyboard: [inlineKeyboard],
						};
					}
				}

				// Add additional fields
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
				if (additionalFields.disableNotification) {
					body.disable_notification = true;
				}
				if (additionalFields.replyToMessageId) {
					body.reply_to_message_id = additionalFields.replyToMessageId;
				}

				// Make the API request
				const url = `https://botapi.rubika.ir/v3/${token}/${endpoint}`;
				
				const response = await this.helpers.request({
					method: 'POST',
					url,
					body,
					headers: {
						'Content-Type': 'application/json',
					},
					json: true,
				});

				returnData.push({
					json: response,
					pairedItem: {
						item: i,
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
