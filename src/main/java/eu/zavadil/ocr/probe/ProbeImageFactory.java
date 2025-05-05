package eu.zavadil.ocr.probe;

import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
@Slf4j
public class ProbeImageFactory {

	@Autowired
	ImageService imageService;

	private InputStream getImageStream(String path) {
		InputStream is = ProbeImageFactory.class.getResourceAsStream(path);
		if (is == null)
			throw new RuntimeException(String.format("Error when opening resource file %s", path));
		return is;
	}

	private ImageFile getTempImage(String path) {
		StorageFile file = this.imageService.getTempDirectory().getFile(path);

		if (!file.exists()) {
			try {
				file.createDirectories();
				File targetFile = file.asFile();
				OutputStream outStream = new FileOutputStream(targetFile);
				InputStream inputStream = this.getImageStream(path);
				inputStream.transferTo(outStream);
				inputStream.close();
				outStream.close();
			} catch (IOException e) {
				throw new RuntimeException("Error when writing tmp file", e);
			}
		}

		return new ImageFile(file);
	}

	public ImageFile createProbeDocImage(String path, FolderChain folder) {
		StorageFile result = this.imageService.getDirectory(folder)
			.getSubdirectory(FileNameUtils.slugify(FileNameUtils.extractBaseName(path)))
			.getFile(FileNameUtils.extractFileName(path));
		if (!result.exists()) {
			ImageFile tmp = this.getTempImage(path);
			if (tmp.exists()) tmp.copyTo(result);
		}
		return new ImageFile(result);
	}

	public ImageFile createProbeTemplateImage(String path, DocumentTemplate template) {
		StorageFile result = this.imageService.getDirectory(template)
			.getFile(FileNameUtils.extractFileName(path));
		if (!result.exists()) {
			ImageFile tmp = this.getTempImage(path);
			if (tmp.exists()) tmp.copyTo(result);
		}
		return new ImageFile(result);
	}

}
