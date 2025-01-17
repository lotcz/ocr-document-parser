package eu.zavadil.ocr.service;

import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageDirectory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Service
@Slf4j
public class ImageService {

	@Autowired
	private FileStorage fileStorage;

	@Autowired
	OpenCvWrapper openCv;

	@Autowired
	PdfBoxWrapper pdf;

	public ImageFile getFile(Path path) {
		return new ImageFile(this.fileStorage.getFile(path));
	}

	public ImageFile getFile(String path) {
		return this.getFile(Path.of(StringUtils.safeTrim(path)));
	}

	public List<ImageFile> upload(StorageDirectory directory, MultipartFile file) {
		String fileName = FileNameUtils.extractFileName(file.getOriginalFilename());
		ImageFile originalFile = new ImageFile(directory.createFile(fileName));
		originalFile.upload(file);

		if (this.openCv.canDecode(originalFile.getAbsolutePath())) {
			return List.of(originalFile);
		}

		// try to decode pages from PDF
		if (originalFile.getExtension().equalsIgnoreCase("pdf")) {
			List<ImageFile> convertedImgs = this.pdf.pdfToImage(originalFile, originalFile.getParentDirectory());
			if (convertedImgs.isEmpty()) {
				throw new RuntimeException(String.format("PDF document %s has no pages!", originalFile));
			}
			log.info("PDF document {} converted into {} pages.", originalFile, convertedImgs.size());
			return convertedImgs;
		}

		throw new RuntimeException(String.format("Document image %s cannot be decoded!", originalFile));
	}

	public List<ImageFile> upload(String directory, MultipartFile file) {
		return this.upload(this.fileStorage.getDirectory(directory), file);
	}
}
