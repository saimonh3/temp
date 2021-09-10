import { assign } from 'lodash';

import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import ImageControl from './imageControl';
import classnames from 'classnames';

const enableBackgroundPatternControlOnBlocks = [
	'core/group',
];

const BACKGROUND_PATTERN_CLASS = 'has-background-pattern';

const groupFilters = [
	{
		hook: 'blocks.registerBlockType',
		namespace: 'havergal/hooks/attribute/background-pattern',
		callback: ( settings, name ) => {
			if ( ! enableBackgroundPatternControlOnBlocks.includes( name ) ) {
				return settings;
			}

			settings.attributes = assign( settings.attributes, {
				backgroundImage: {
					type: 'object',
					default: {},
				},
				backgroundStyle: {
					type: 'object',
					default: {},
				},
				focalPoint: {
					type: 'object',
					default: {
						x: 0.5,
						y: 0.5,
					},
				},
			} );

			return settings;
		},
	},
	{
		hook: 'editor.BlockEdit',
		namespace: 'project/filters/with-block-max-width-control',
		callback: createHigherOrderComponent( ( BlockEdit ) => {
			return ( props ) => {
				if ( ! enableBackgroundPatternControlOnBlocks.includes( props.name ) ) {
					return (
						<BlockEdit { ...props } />
					);
				}

				const { attributes: {
					backgroundImage,
					backgroundStyle,
				}, setAttributes } = props;

				return (
					<>
						<BlockEdit { ...props } />
						<InspectorControls>
							<PanelBody title={ __( 'Background Pattern', 'hgc' ) }>
								<ImageControl
									onSelect={ ( image ) => setAttributes( { backgroundImage: image } ) }
									onRemove={ () => setAttributes( { backgroundImage: {} } ) }
									image={ backgroundImage }
									attributes={ props?.attributes }
									setAttributes={ setAttributes }
								/>

								{ backgroundImage?.id &&
								<>
									<SelectControl
										label={ __( 'Background Size', 'hgc' ) }
										value={ backgroundStyle?.backgroundSize }
										options={ [
											{ label: __( 'Cover', 'hgc' ), value: 'cover' },
											{ label: __( 'Contain', 'hgc' ), value: 'contain' },
											{ label: __( 'Auto', 'hgc' ), value: 'auto' },
										] }
										onChange={ ( backgroundSize ) => setAttributes( {
											backgroundStyle: { ...backgroundStyle, backgroundSize },
										} ) }
									/>

									<SelectControl
										label={ __( 'Background Repeat', 'hgc' ) }
										value={ backgroundStyle?.backgroundRepeat }
										options={ [
											{ label: __( 'No Repeat', 'hgc' ), value: 'no-repeat' },
											{ label: __( 'Repeat', 'hgc' ), value: 'repeat' },
											{ label: __( 'Space', 'hgc' ), value: 'space' },
											{ label: __( 'Round', 'hgc' ), value: 'round' },
											{ label: __( 'Repeat X', 'hgc' ), value: 'repeat-x' },
											{ label: __( 'Repeat Y', 'hgc' ), value: 'repeat-y' },
										] }
										onChange={ ( backgroundRepeat ) => setAttributes( {
											backgroundStyle: { ...backgroundStyle, backgroundRepeat },
										} ) }

									/>

									<SelectControl
										label={ __( 'Background Attachment', 'hgc' ) }
										value={ backgroundStyle?.backgroundAttachment }
										options={ [
											{ label: __( 'Scroll', 'hgc' ), value: 'scroll' },
											{ label: __( 'Fixed', 'hgc' ), value: 'fixed' },
											{ label: __( 'Local', 'hgc' ), value: 'local' },
										] }
										onChange={ ( backgroundAttachment ) => setAttributes( {
											backgroundStyle: { ...backgroundStyle, backgroundAttachment },
										} ) }
									/>

									<SelectControl
										label={ __( 'Background Blend Mode', 'hgc' ) }
										value={ backgroundStyle?.backgroundBlendMode }
										options={ [
											{ label: __( 'Normal', 'hgc' ), value: 'normal' },
											{ label: __( 'Multiply', 'hgc' ), value: 'multiply' },
											{ label: __( 'Screen', 'hgc' ), value: 'screen' },
											{ label: __( 'Overlay', 'hgc' ), value: 'overlay' },
											{ label: __( 'Darken', 'hgc' ), value: 'darken' },
											{ label: __( 'lighten', 'hgc' ), value: 'lighten' },
											{ label: __( 'Color Dodge', 'hgc' ), value: 'color-dodge' },
											{ label: __( 'Saturation', 'hgc' ), value: 'saturation' },
											{ label: __( 'Color', 'hgc' ), value: 'color' },
											{ label: __( 'Luminosity', 'hgc' ), value: 'luminosity' },
										] }
										onChange={ ( backgroundBlendMode ) => setAttributes( {
											backgroundStyle: { ...backgroundStyle, backgroundBlendMode },
										} ) }
									/>
								</>
								}
							</PanelBody>
						</InspectorControls>
					</>
				);
			};
		}, 'withBackgroundPatternControl' ),
	},
	{
		hook: 'editor.BlockListBlock',
		namespace: 'havergal/hooks/custom-class/background-pattern',
		callback: createHigherOrderComponent( ( BlockListBlock ) => {
			return ( props ) => {
				if ( ! enableBackgroundPatternControlOnBlocks.includes( props.name ) || ! props?.attributes?.backgroundImage?.id ) {
					return (
						<BlockListBlock { ...props } />
					);
				}

				const { backgroundImage, backgroundStyle: { backgroundSize, backgroundRepeat, backgroundAttachment, backgroundBlendMode }, focalPoint } = props?.attributes;
				const classNames = backgroundImage?.id ? `${ BACKGROUND_PATTERN_CLASS } has-background-${ backgroundRepeat }` : '';
				const wrapperProps = props?.wrapperProps ? props.wrapperProps : {};

				wrapperProps.style = {
					backgroundImage: `url( ${ backgroundImage?.url } )`,
					backgroundPosition: `${ focalPoint?.x * 100 }% ${ focalPoint?.y * 100 }%`,
					backgroundSize,
					backgroundAttachment,
					backgroundBlendMode,
				};

				return (
					<>
						<BlockListBlock { ...props } className={ classNames } wrapperProps={ wrapperProps } />
					</>
				);
			};
		}, 'withBackgroundPatternClass' ),
	},
	{
		hook: 'blocks.getSaveContent.extraProps',
		namespace: 'havergal/hooks/savedContent/background-pattern',
		callback: ( props, blockType, attributes ) => {

			if ( ! enableBackgroundPatternControlOnBlocks.includes( blockType?.name ) ) {
				return props;
			}

			if ( ! attributes?.backgroundImage?.id ) {
				return props;
			}

			const { backgroundImage, backgroundStyle: { backgroundSize, backgroundRepeat, backgroundAttachment, backgroundBlendMode }, focalPoint } = attributes;
			const className = classnames( props.className, { [ `${ BACKGROUND_PATTERN_CLASS } has-background-${ backgroundRepeat }` ]: backgroundImage?.id } );

			const style = {
				backgroundImage: `url( ${ backgroundImage?.url } )`,
				backgroundPosition: `${ focalPoint?.x * 100 }% ${ focalPoint?.y * 100 }%`,
				backgroundSize,
				backgroundAttachment,
				backgroundBlendMode,
			};

			return assign( props, { className, style } );
		},
	},
];

export default groupFilters;
