package eu.zavadil.ocr.api.admin;

import eu.zavadil.ocr.api.exceptions.NotAuthorizedException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.api.exceptions.ServerErrorException;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

@RestController
@RequestMapping("${api.base-url}/images")
@Tag(name = "Images")
@Slf4j
public class ImagesController {

	@Autowired
	ImageService imageService;

	@GetMapping("")
	@ResponseBody
	@Operation(summary = "Load image.")
	public ResponseEntity<InputStreamResource> image(
		@RequestParam("path") String path,
		@RequestParam(name = "size", defaultValue = "original", required = false) ImageService.Size size
	) {
		ImageFile image = this.imageService.getImage(path, size);
		if (!image.exists()) {
			throw new ResourceNotFoundException("Image", path);
		}
		try {
			InputStream is = new FileInputStream(image.asFile());
			return ResponseEntity.ok()
				.contentType(image.getMediaType())
				.body(new InputStreamResource(is));
		} catch (FileNotFoundException e) {
			throw new ResourceNotFoundException("File", image.getAbsolutePath(), e);
		} catch (SecurityException e) {
			throw new NotAuthorizedException("File", image.getAbsolutePath(), e);
		} catch (Exception e) {
			throw new ServerErrorException(e);
		}
	}
}
