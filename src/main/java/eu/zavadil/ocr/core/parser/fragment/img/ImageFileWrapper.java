package eu.zavadil.ocr.core.parser.fragment.img;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

public class ImageFileWrapper {

	private final Path path;

	public ImageFileWrapper(Path path) {
		this.path = path;
	}

	public ImageFileWrapper(File file) {
		this(file.toPath());
	}

	public ImageFileWrapper(String file) {
		this(Path.of(file));
	}

	public static ImageFileWrapper of(Path path) {
		return new ImageFileWrapper(path);
	}

	public static ImageFileWrapper of(File file) {
		return new ImageFileWrapper(file);
	}

	public static ImageFileWrapper of(String path) {
		return new ImageFileWrapper(path);
	}

	public Path asPath() {
		return this.path;
	}

	public File asFile() {
		return this.path.toFile();
	}

	public String asAbsolute() {
		return this.path.toAbsolutePath().toString();
	}

	public String asRelative() {
		return this.path.toString();
	}

	@Override
	public String toString() {
		return this.asAbsolute();
	}

	public boolean exists() {
		return Files.exists(this.path);
	}

	public String getDirName() {
		return this.path.getParent().toString();
	}

	public String getFileName() {
		return this.path.getFileName().toString();
	}

	public String getExtension() {
		String fileName = this.getFileName();
		String extension = "";

		int i = fileName.lastIndexOf('.');
		if (i > 0) {
			extension = fileName.substring(i + 1);
		}

		return extension;
	}

	public String getBaseName() {
		String fileName = this.getFileName();
		String base;

		int i = fileName.lastIndexOf('.');
		if (i > 0) {
			base = fileName.substring(0, i);
		} else {
			base = fileName;
		}

		return base;
	}

	public String getRegularName() {
		String baseName = this.getBaseName();
		String regular;

		int i = baseName.lastIndexOf('_');
		if (i > 0) {
			regular = baseName.substring(0, i);
		} else {
			regular = baseName;
		}

		return regular;
	}

	public int getNumber() {
		String baseName = this.getBaseName();
		int n = 0;

		int i = baseName.lastIndexOf('_');
		if (i > 0) {
			String nStr = baseName.substring(i + 1);
			n = Integer.parseInt(nStr);
		}

		return n;
	}

	public ImageFileWrapper createNext() {
		String fileName = String.format(
			"%s_%d.%s",
			this.getRegularName(),
			this.getNumber() + 1,
			this.getExtension()
		);
		return new ImageFileWrapper(Path.of(this.getDirName(), fileName));
	}

}
