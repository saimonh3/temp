import { Button, FocalPointPicker } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

const ImageControl = ( props ) => {
	const { onSelect, image, onRemove, attributes: { focalPoint }, setAttributes } = props;
	const hasUploadedImage = image?.id;
	const IMAGE_UPLOAD_TITLE = hasUploadedImage ? __( 'Replace Background Image', 'hgc' ) : __( 'Upload Background Image', 'hgc' );

	return (
		<div className="group-block-background-pattern-control">
			{ hasUploadedImage &&
				<FocalPointPicker
					label={ __( 'Set Focal Point', 'hgc' ) }
					url={ image?.url }
					value={ focalPoint }
					onChange={ ( focalPoints ) => setAttributes( { focalPoint: focalPoints } ) }
				/>
			}

			<MediaUploadCheck>
				<MediaUpload
					onSelect={ onSelect }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					value={ image?.id }
					render={ ( { open } ) => (
						<Button
							onClick={ open }
							className={ classNames( {
								'editor-post-featured-image__toggle': ! hasUploadedImage,
								'is-secondary replace-background-btn': hasUploadedImage,
							} ) }
						>
							{ IMAGE_UPLOAD_TITLE }
						</Button>
					) }
				/>
			</MediaUploadCheck>

			{ hasUploadedImage &&
				<Button
					className="is-secondary"
					onClick={ onRemove }
					label={ __( 'Remove Image', 'hgc' ) }
				>
					{ __( 'Remove Image', 'hgc' ) }
				</Button>
			}
		</div>
	);
};

export default ImageControl;
