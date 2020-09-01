import {
	createNodeDescriptor,
	INodeFunctionBaseParams
}
from "@cognigy/extension-tools";

export interface IHandoverParams extends INodeFunctionBaseParams {
	config: {
		handoverReason: string;
		transferTarget: string;
	};
}
export const handoverNode = createNodeDescriptor({
	type: "handover",
	defaultLabel: "Handover",
	fields: [{
			key: "handoverReason",
			label: "Reason",
			type: "cognigyText",
			defaultValue: "Bot initiated handover",
			params: {
				required: true
			}
		}, {
			key: "transferTarget",
			label: "Target",
			type: "cognigyText",
			params: {
				required: true,
				placeholder: "tel:+49123456789"
			}
		},
	],
	form: [{
			type: "field",
			key: "handoverReason"
		}, {
			type: "field",
			key: "transferTarget"
		}
	],
	function : async({
		cognigy,
		config
	}
		: IHandoverParams) => {
		const {
			api
		} = cognigy;
		const {
			handoverReason,
			transferTarget
		} = config;

		if (!handoverReason)
			throw new Error('The handover reason is missing.');
		if (!transferTarget)
			throw new Error('The handover target is missing.');

		api.output('', {
			"_cognigy": {
				"_audioCodes": {
					"json": {
						"activities": [{
								"type": "event",
								"name": "handover",
								"activityParams": {
									transferTarget,
									handoverReason
								}
							}
						]
					}
				}
			}
		});
	}
});