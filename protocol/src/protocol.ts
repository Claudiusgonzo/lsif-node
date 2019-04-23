/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as lsp from 'vscode-languageserver-protocol';

/**
 * An `Id` to identify a vertex or an edge.
 */
export type Id = number | string;

/**
 * An element in the graph.
 */
export interface Element {
	id: Id;
	type: ElementTypes;
}

export enum ElementTypes {
	vertex = 'vertex',
	edge = 'edge'
}

/**
 * All know vertices label values.
 */
export enum VertexLabels {
	metaData = 'metaData',
	project = 'project',
	range = 'range',
	location = 'location',
	document = 'document',
	moniker = 'moniker',
	packageInformation = 'packageInformation',
	resultSet = 'resultSet',
	documentSymbolResult = 'documentSymbolResult',
	foldingRangeResult = 'foldingRangeResult',
	documentLinkResult = 'documentLinkResult',
	diagnosticResult = 'diagnosticResult',
	declarationResult = 'declarationResult',
	definitionResult = 'definitionResult',
	typeDefinitionResult = 'typeDefinitionResult',
	hoverResult = 'hoverResult',
	referenceResult = 'referenceResult',
	implementationResult = 'implementationResult'
}

/**
 * Uris are currently stored as strings.
 */
export type Uri = string;

export interface V extends Element {
	type: ElementTypes.vertex;
	label: VertexLabels;
}

/**
 * A result set acts as a hub to share n LSP request results
 * between different ranges.
 */
export interface ResultSet extends V {
	label: VertexLabels.resultSet;
}

/**
 * All know range tag literal types.
 */
export enum RangeTagTypes {
	declaration = 'declaration',
	definition = 'definition',
	reference = 'reference',
	unknown = 'unknown'
}

/**
 * The range represents a declaration.
 */
export interface DeclarationTag {

	/**
	 * A type identifier for the declaration tag.
	 */
	type: RangeTagTypes.declaration;

	/**
	 * The text covered by the range.
	 */
	text: string;

	/**
	 * The symbol kind.
	 */
	kind: lsp.SymbolKind;

	/**
	 * Indicates if this symbol is deprecated.
	 */
	deprecated?: boolean;

	/**
	 * The full range of the declaration not including leading/trailing whitespace but everything else, e.g comments and code.
	 * The range must be included in fullRange.
	 */
	fullRange: lsp.Range;

	/**
	 * Optional detail information for the declaration.
	 */
	detail?: string;
}

/**
 * The range represents a definition
 */
export interface DefinitionTag {
	/**
	 * A type identifier for the declaration tag.
	 */
	type: RangeTagTypes.definition;

	/**
	 * The text covered by the range
	 */
	text: string;

	/**
	 * The symbol kind.
	 */
	kind: lsp.SymbolKind;

	/**
	 * Indicates if this symbol is deprecated.
	 */
	deprecated?: boolean;

	/**
	 * The full range of the definition not including leading/trailing whitespace but everything else, e.g comments and code.
	 * The range must be included in fullRange.
	 */
	fullRange: lsp.Range;

	/**
	 * Optional detail information for the definition.
	 */
	detail?: string;
}

/**
 * The range represents a reference.
 */
export interface ReferenceTag {

	/**
	 * A type identifier for the reference tag.
	 */
	type: RangeTagTypes.reference;

	/**
	 * The text covered by the range.
	 */
	text: string;
}

/**
 * The type of the range is unknown.
 */
export interface UnknownTag {

	/**
	 * A type identifier for the unknown tag.
	 */
	type: RangeTagTypes.unknown;

	/**
	 * The text covered by the range.
	 */
	text: string;
}

/**
 * All available range tag types.
 */
export type RangeTag = DefinitionTag | DeclarationTag | ReferenceTag | UnknownTag;


/**
 * A vertex representing a range inside a document.
 */
export interface Range extends V, lsp.Range {

	label: VertexLabels.range;

	/**
	 * Some optional meta data for the range.
	 */
	tag?: RangeTag;
}

/**
 * The id type of the range is a normal id.
 */
export type RangeId = Id;

/**
 * A range representing a definition.
 */
export interface DefinitionRange extends Range {
	/**
	 * The definition meta data.
	 */
	tag: DefinitionTag;
}

/**
 * A range representing a declaration.
 */
export interface DeclarationRange extends Range {
	/**
	 * The declaration meta data.
	 */
	tag: DeclarationTag;
}

/**
 * A range representing a reference.
 */
export interface ReferenceRange extends Range {
	/**
	 * The reference meta data.
	 */
	tag: ReferenceTag;
}

/**
 * A location emittable in LSIF. It has no uri since
 * like ranges locations should be connected to a document
 * using a `contains`edge.
 */
export interface Location extends V {
	/**
	 * The label property.
	 */
	label: VertexLabels.location;

	/**
	 * The location's range
	 */
	range: lsp.Range;
}

/**
 * The meta data vertex.
 */
export interface MetaData extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.metaData;

	/**
	 * The version of the LSIF format using semver notation. See https://semver.org/
	 */
	version: string;

	/**
	 * The project root to compute this dump.
	 */
	projectRoot?: string;

	/**
	 * Information about the tool that created the dump
	 */
	toolInfo?: {
		name: string;
		args?: string[];
	}
}

export type AdditionDataValueType = string | number | boolean | string[] | number[] | boolean[];
export interface AdditionalData {
	[key: string]: AdditionDataValueType | AdditionalData | AdditionalData[];
}

/**
 * A document tag allows Indexers to tag documents for special
 * purposes
 */
export interface ProjectData extends AdditionalData {
}

/**
 * A project vertex.
 */
export interface Project extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.project;

	/**
	 * The project kind like 'typescript' or 'csharp'. See also the language ids
	 * in the [specification](https://microsoft.github.io/language-server-protocol/specification)
	 */
	kind: string;

	/**
	 * The resource URI of the project file.
	 */
	resource?: Uri;

	/**
	 * Optional project data specific to the programming language.
	 */
	data?: ProjectData;

	/**
	 * Optional the content of the project file, `base64` encoded.
	 */
	contents?: string;
}

/**
 * A document tag allows Indexers to tag documents for special
 * purposes
 */
export interface DocumentData extends AdditionalData {
}

export type DocumentId = Id;

/**
 * A vertex representing a document in the project
 */
export interface Document extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.document;

	/**
	 * The Uri of the document.
	 */
	uri: Uri;

	/**
	 * The document's language Id as defined in the LSP
	 * (https://microsoft.github.io/language-server-protocol/specification)
	 */
	languageId: string;

	/**
	 * Optional document data specific to the programming language.
	 */
	data?: DocumentData;

	/**
	 * Optional the content of the document, `based64` encoded
	 */
	contents?: string;
}

/**
 * The moniker kind.
 */
export enum MonikerKind {
	/**
	 * The moniker represent a symbol that is imported into a project
	 */
	import = 'import',

	/**
	 * The moniker represents a symbol that is exported from a project
	 */
	export = 'export'
}

export interface Moniker extends V {

	label: VertexLabels.moniker;

	/**
	 * The moniker kind.
	 */
	kind: MonikerKind;

	/**
	 * The scheme of the moniker. For example tsc or .Net
	 */
	scheme: string;

	/**
	 * The identifier of the moniker. The value is opaque in LSIF however
	 * schema owners are allowed to define the structure if they want.
	 */
	identifier: string;
}

export interface PackageInformation extends V {

	label: VertexLabels.packageInformation;

	/**
	 * The package name
	 */
	name: string;

	/**
	 * The package manager
	 */
	manager: string;

	/**
	 * A uri pointing to the location of the file describing the package.
	 */
	uri?: string;

	/**
	 * Optional the content of the document, `based64` encoded
	 */
	contents?: string;

	/**
	 * The package version if available
	 */
	version?: string;

	/**
	 * Otional information about the repository containing the source of the package
	 */
	repository?: {
		/**
		 * The repository type. For example GIT
		 */
		type: string;

		/**
		 * The URL to the repository
		 */
		url: string;

		/**
		 * A commitId if available.
		 */
		commitId?: string;
	}
}

/**
 * A range based document symbol. This allows to reuse already
 * emitted ranges with a `declaration` tag in a document symbol
 * result.
 */
export interface RangeBasedDocumentSymbol {
	/**
	 * The range to reference.
	 */
	id: RangeId

	/**
	 * The child symbols.
	 */
	children?: RangeBasedDocumentSymbol[];
}

/**
 * A vertex representing the document symbol result.
 */
export interface DocumentSymbolResult extends V {

	label: VertexLabels.documentSymbolResult;

	result: lsp.DocumentSymbol[] | RangeBasedDocumentSymbol[];
}

/**
 * A vertex representing a diagnostic result.
 */
export interface DiagnosticResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.diagnosticResult;

	/**
	 * The diagnostics.
	 */
	result: lsp.Diagnostic[];
}

/**
 * A vertex representing a folding range result.
 */
export interface FoldingRangeResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.foldingRangeResult;

	/**
	 * The actual folding ranges.
	 */
	result: lsp.FoldingRange[];
}

/**
 * A vertex representing a document link result.
 */
export interface DocumentLinkResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.documentLinkResult;

	/**
	 * The actual document links.
	 */
	result: lsp.DocumentLink[];
}

export interface DeclarationResult extends V {
	/**
	 * The label property.
	 */
	label: VertexLabels.declarationResult;

	/**
	 * The actual result.
	 */
	result?: (RangeId | lsp.Location)[];
}

/**
 * A vertex representing a definition result.
 */
export interface DefinitionResult extends V {
	/**
	 * The label property.
	 */
	label: VertexLabels.definitionResult;

	/**
	 * The actual result.
	 */
	result?: (RangeId | lsp.Location)[];
}

/**
 * A vertex representing a type definition result.
 */
export interface TypeDefinitionResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.typeDefinitionResult;

	/**
	 * The actual result.
	 */
	result?: (RangeId | lsp.Location)[];
}

/**
 * A vertex representing a Hover.
 *
 * Extends the `Hover` type defined in LSP.
 */
export interface HoverResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.hoverResult;

	/**
	 * The hover result. This is the normal LSP hover result.
	 */
	result: lsp.Hover;
}

/**
 * The id type of a reference result is a normal id.
 */
export type ReferenceResultId = Id;

export type ReferenceResultItem = (RangeId | lsp.Location);

/**
 * A vertex representing a reference result.
 */
export interface ReferenceResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.referenceResult;

	/**
	 * The declarations belonging to the reference result.
	 */
	declarations?: ReferenceResultItem[];

	/**
	 * The definitions belonging to the reference result.
	 */
	definitions?: ReferenceResultItem[];

	/**
	 * The references belonging to the reference result.
	 */
	references?: ReferenceResultItem[];

	/**
	 * The reference results belonging to this reference result.
	 */
	referenceResults?: ReferenceResultId[];
}

export namespace ReferenceResult {
	export function isStatic(result: ReferenceResult): result is ((ReferenceResult & { referenceResults: ReferenceResultId[] }) | (ReferenceResult & { declarations: ReferenceResultItem[]; definitions: ReferenceResultItem[]; references: ReferenceResultItem[] })) {
		return (result.declarations !== undefined && result.definitions !== undefined && result.references !== undefined)
			|| result.referenceResults !== undefined;
	}
}


/**
 * The id type of an implementation result is a normal id.
 */
export type ImplementationResultId = Id;

/**
 * A vertex representing an implementation result.
 */
export interface ImplementationResult extends V {

	/**
	 * The label property.
	 */
	label: VertexLabels.implementationResult;

	/**
	 * The ranges and locations belong to the implementation result.
	 */
	result?: (RangeId | lsp.Location)[];

	/**
	 * The other implementation results belonging to this result.
	 */
	implementationResults?: ImplementationResultId[];
}

/**
 * All available vertex types
 */
export type Vertex =
	MetaData |
	Project |
	Document |
	Moniker |
	PackageInformation |
	ResultSet |
	Range |
	DocumentSymbolResult |
	FoldingRangeResult |
	DocumentLinkResult |
	DiagnosticResult |
	DefinitionResult |
	DeclarationResult |
	TypeDefinitionResult |
	HoverResult |
	ReferenceResult |
	ImplementationResult;

export enum EdgeLabels {
	contains = 'contains',
	item = 'item',
	refersTo = 'refersTo',
	moniker = 'moniker',
	packageInformation = 'packageInformation',
	textDocument_documentSymbol = 'textDocument/documentSymbol',
	textDocument_foldingRange = 'textDocument/foldingRange',
	textDocument_documentLink = 'textDocument/documentLink',
	textDocument_diagnostic = 'textDocument/diagnostic',
	textDocument_definition = 'textDocument/definition',
	textDocument_declaration = 'textDocument/declaration',
	textDocument_typeDefinition = 'textDocument/typeDefinition',
	textDocument_hover = 'textDocument/hover',
	textDocument_references = 'textDocument/references',
	textDocument_implementation = 'textDocument/implementation',
}

/**
 * A common base type of all edge types. The type parameters `S` and `T` are for typing and
 * documentation purpose only. An edge never holds a direct reference to a vertex. They are
 * referenced by `Id`.
 */
export interface E<S extends V, T extends V, K extends EdgeLabels> extends Element {
	/* The brand.  This is only necessary to make make type instantiation differ from each other. */
	_?: [S, T];
	id: Id;
	type: ElementTypes.edge;
	label: K;

	/**
	 * The id of the from Vertex.
	 */
	outV: Id;

	/**
	 * The id of the to Vertex.
	 */
	inV: Id;
}

export enum ItemEdgeProperties {
	declarations = 'declarations',
	definitions = 'definitions',
	references =  'references',
	referenceResults = 'referenceResults',
	implementationResults = 'implementationResults'
}

export interface ItemEdge<S extends V, T extends V> extends E<S, T, EdgeLabels.item> {
	property?: ItemEdgeProperties;
}

/**
 * An edge expressing containment relationship. The relationship exist between:
 *
 * - `Project` -> `Document`
 * - `Package` -> `Document`
 * - `Document` -> `Range`
 */
export type contains = E<Project, Document, EdgeLabels.contains> | E<Document, Range, EdgeLabels.contains>;

/**
 * An edge associating a range with a result set. The relationship exists between:
 *
 * - `Range` -> `ResultSet`
 */
export type refersTo = E<Range, ResultSet, EdgeLabels.refersTo>;

/**
 * An edge representing a item in a result set. The relationship exists between:
 *
 * - `ReferenceResult` -> `Range`
 * - `ReferenceResult` -> `ReferenceResult`
 * - `ExportResult` -> `ExportResultItem`
 * - `ExternalImportResult` -> `ExternalImportItem`
 */
export type item = ItemEdge<ReferenceResult, Range> | ItemEdge<ReferenceResult, ReferenceResult> | ItemEdge<ImplementationResult, Range> | ItemEdge<ImplementationResult, ImplementationResult>;

/**
 * An edge associating a range with a moniker. The relationship exists between:
 *
 * - `Range` -> `Moniker`
 */
export type moniker = E<Range, Moniker, EdgeLabels.moniker>;


/**
 * An edge associating a moniker with a package information. The relationship exists between:
 *
 * - `Moniker` -> `PackageInformation`
 */
export type packageInformation = E<Moniker, PackageInformation, EdgeLabels.packageInformation>;


/**
 * An edge representing a `textDocument/documentSymbol` relationship. The relationship exists between:
 *
 * - `Document` -> `DocumentSymbolResult`
 */
export type textDocument_documentSymbol = E<Document, DocumentSymbolResult, EdgeLabels.textDocument_documentSymbol>;

/**
 * An edge representing a `textDocument/foldingRange` relationship. The relationship exists between:
 *
 * - `Document` -> `FoldingRangeResult`
 */
export type textDocument_foldingRange = E<Document, FoldingRangeResult, EdgeLabels.textDocument_foldingRange>;

/**
 * An edge representing a `textDocument/documentLink` relationship. The relationship exists between:
 *
 * - `Document` -> `DocumentLinkResult`
 */
export type textDocument_documentLink = E<Document, DocumentLinkResult, EdgeLabels.textDocument_documentLink>;

/**
 * An edge representing a `textDocument/diagnostic` relationship. The relationship exists between:
 *
 * - `Project` -> `DiagnosticResult`
 * - `Document` -> `DiagnosticResult`
 */
export type textDocument_diagnostic = E<Project, DiagnosticResult, EdgeLabels.textDocument_diagnostic> | E<Document, DiagnosticResult, EdgeLabels.textDocument_diagnostic>;

/**
 * An edge representing a declaration relationship. The relationship exists between:
 *
 * - `Range` -> `DefinitionResult`
 * - `ResultSet` -> `DefinitionResult`
 */
export type textDocument_declaration = E<Range, DeclarationResult, EdgeLabels.textDocument_declaration> | E<ResultSet, DeclarationResult, EdgeLabels.textDocument_declaration>;

/**
 * An edge representing a definition relationship. The relationship exists between:
 *
 * - `Range` -> `DefinitionResult`
 * - `ResultSet` -> `DefinitionResult`
 */
export type textDocument_definition = E<Range, DefinitionResult, EdgeLabels.textDocument_definition> | E<ResultSet, DefinitionResult, EdgeLabels.textDocument_definition>;

/**
 * An edge representing a type definition relations ship. The relationship exists between:
 *
 * - `Range` -> `TypeDefinitionResult`
 * - `ResultSet` -> `TypeDefinitionResult`
 */
export type textDocument_typeDefinition = E<Range, TypeDefinitionResult, EdgeLabels.textDocument_typeDefinition> | E<ResultSet, TypeDefinitionResult, EdgeLabels.textDocument_typeDefinition>;

/**
 * An edge representing a hover relationship. The relationship exists between:
 *
 * - `Range` -> `HoverResult`
 * - `ResultSet` -> `HoverResult`
 */
export type textDocument_hover = E<Range, HoverResult, EdgeLabels.textDocument_hover> | E<ResultSet, HoverResult, EdgeLabels.textDocument_hover>;

/**
 * An edge representing a references relationship. The relationship exists between:
 *
 * - `Range` -> `ReferenceResult`
 * - `ResultSet` -> `ReferenceResult`
 */
export type textDocument_references = E<Range, ReferenceResult, EdgeLabels.textDocument_references> | E<ResultSet, ReferenceResult, EdgeLabels.textDocument_references>;

/**
 * An edge representing a implementation relationship. The relationship exists between:
 *
 * - `Range` -> `ImplementationResult`
 * - `ResultSet` -> `ImplementationResult`
 */
export type textDocument_implementation = E<Range, ImplementationResult, EdgeLabels.textDocument_implementation> | E<ResultSet, ImplementationResult, EdgeLabels.textDocument_implementation>;

/**
 *
 * All available Edge types.
 */
export type Edge =
	contains |
	item |
	refersTo |
	moniker |
	packageInformation |
	textDocument_documentSymbol |
	textDocument_foldingRange |
	textDocument_documentLink |
	textDocument_diagnostic |
	textDocument_definition |
	textDocument_typeDefinition |
	textDocument_hover |
	textDocument_references |
	textDocument_implementation;
