import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RubikaBotApi implements ICredentialType {
	name = 'rubikaBot';
	displayName = 'Rubika Bot API';
	documentationUrl = 'https://rubika.ir/botapi';
	properties: INodeProperties[] = [
		{
			displayName: 'Bot Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Bot token received from @BotFather in Rubika',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			method: 'POST',
			url: '=https://botapi.rubika.ir/v3/{{$credentials.token}}/getMe',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};
}
