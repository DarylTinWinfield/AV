import {URL} from 'node:url';

export namespace SharedWorker {
	export type ProtocolIdentifier = 'ava-4';

	export type FactoryOptions = {
		negotiateProtocol <Data = unknown>(supported: readonly ['ava-4']): Protocol<Data>;
		// Add overloads for additional protocols.
	};

	export type Factory = (options: FactoryOptions) => void;

	export type Protocol<Data = unknown> = {
		readonly initialData: Data;
		readonly protocol: 'ava-4';
		broadcast: (data: Data) => BroadcastMessage<Data>;
		ready: () => Protocol<Data>;
		subscribe: () => AsyncIterableIterator<ReceivedMessage<Data>>;
		testWorkers: () => AsyncIterableIterator<TestWorker<Data>>;
	};

	export type BroadcastMessage<Data = unknown> = {
		readonly id: string;
		replies: () => AsyncIterableIterator<ReceivedMessage<Data>>;
	};

	export type PublishedMessage<Data = unknown> = {
		readonly id: string;
		replies: () => AsyncIterableIterator<ReceivedMessage<Data>>;
	};

	export type ReceivedMessage<Data = unknown> = {
		readonly data: Data;
		readonly id: string;
		readonly testWorker: TestWorker;
		reply: (data: Data) => PublishedMessage<Data>;
	};

	export type TestWorker<Data = unknown> = {
		readonly id: string;
		readonly file: string;
		publish: (data: Data) => PublishedMessage<Data>;
		subscribe: () => AsyncIterableIterator<ReceivedMessage<Data>>;
		teardown: <TeardownFn extends () => void> (fn: TeardownFn) => TeardownFn;
	};

	export namespace Plugin {
		export type RegistrationOptions<Identifier extends ProtocolIdentifier, Data = unknown> = {
			readonly filename: string | URL;
			readonly initialData?: Data;
			readonly supportedProtocols: readonly Identifier[];
			readonly teardown?: () => void;
		};

		export type Protocol<Data = unknown> = {
			readonly available: Promise<void>;
			readonly currentlyAvailable: boolean;
			readonly protocol: 'ava-4';
			publish: (data: Data) => PublishedMessage<Data>;
			subscribe: () => AsyncIterableIterator<ReceivedMessage<Data>>;
		};

		export type PublishedMessage<Data = unknown> = {
			readonly id: string;
			replies: () => AsyncIterableIterator<ReceivedMessage<Data>>;
		};

		export type ReceivedMessage<Data = unknown> = {
			readonly data: Data;
			readonly id: string;
			reply: (data: Data) => PublishedMessage<Data>;
		};
	}
}

export function registerSharedWorker<Data = unknown>(options: SharedWorker.Plugin.RegistrationOptions<'ava-4', Data>): SharedWorker.Plugin.Protocol<Data>;
// Add overloads for additional protocols.

export namespace Concordance {
	export type ProtocolIdentifier = 'ava-4.1';

	export type RegistrationOptions<Identifier extends ProtocolIdentifier> = {
		readonly supportedProtocols: readonly Identifier[];
	};

	export interface Theme { // eslint-disable-line @typescript-eslint/consistent-indexed-object-style
		[field: string]: string | Theme;
	}

	// N.B. Concordance doesn't have a type definition we can re-export.
	export type Plugin = {
		name: string;
		apiVersion: number;
		minimalConcordanceVersion?: string;
		serializerVersion: number;
		theme?: Theme;
		register: (api: Record<string, unknown>) => (value: unknown) => Function | null; // eslint-disable-line @typescript-eslint/ban-types
	};

	export type Protocol = {
		readonly maxColorLevel: number;
		extendTheme: (theme: Theme) => void;
		appendPlugin: (plugin: Plugin) => void;
	};
}

export function extendConcordance(options: Concordance.RegistrationOptions<'ava-4.1'>): Concordance.Protocol;
// Add overloads for additional protocols.
