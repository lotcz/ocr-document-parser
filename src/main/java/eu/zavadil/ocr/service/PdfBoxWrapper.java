package eu.zavadil.ocr.service;

import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageDirectory;
import eu.zavadil.ocr.storage.StorageFile;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class PdfBoxWrapper {

	public ImageFile extractPage(StorageFile pdf, StorageDirectory target, String extension, int page) {
		try {
			try (PDDocument document = Loader.loadPDF(pdf.asFile())) {
				if (document.getNumberOfPages() <= page) {
					return null;
				}
				PDFRenderer pdfRenderer = new PDFRenderer(document);
				BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
				String filename = String.format("%s-page%d.%s", pdf.getRegularName(), page, extension);
				ImageFile pageImg = new ImageFile(target.getUnusedFile(filename));
				ImageIOUtil.writeImage(bim, pageImg.getAbsolutePath(), 300);
				return pageImg;
			}
		} catch (IOException e) {
			throw new RuntimeException(String.format("Failed to extract page %d from PDF!", page), e);
		}
	}

	public List<ImageFile> extractPages(StorageFile pdf, StorageDirectory target, String extension) {
		try {
			try (PDDocument document = Loader.loadPDF(pdf.asFile())) {
				PDFRenderer pdfRenderer = new PDFRenderer(document);
				List<ImageFile> files = new ArrayList<>();
				for (int page = 0; page < document.getNumberOfPages(); ++page) {
					BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
					String filename = String.format("%s-page%d.%s", pdf.getRegularName(), page, extension);
					ImageFile pageImg = new ImageFile(target.getUnusedFile(filename));
					ImageIOUtil.writeImage(bim, pageImg.getAbsolutePath(), 300);
					files.add(pageImg);
				}
				return files;
			}
		} catch (Exception e) {
			throw new RuntimeException("Failed to convert PDF to image", e);
		}
	}

	public List<ImageFile> extractPages(StorageFile pdf, StorageDirectory target) {
		return this.extractPages(pdf, target, "png");
	}

	public ImageFile extractPage(StorageFile pdf, StorageDirectory target, int page) {
		return this.extractPage(pdf, target, "png", page);
	}

}
