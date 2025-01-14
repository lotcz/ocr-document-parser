package eu.zavadil.ocr.core.storage;

import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.StorageDirectory;
import eu.zavadil.ocr.storage.StorageFile;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.nio.file.Path;

public class FileStorageTest {

	@Test
	public void storageTestDirectories() {
		FileStorage storage = new FileStorage(Path.of("test/one/two"));
		StorageDirectory home = storage.getHomeDirectory();
		StorageDirectory three = home.createSubdirectory("three");

		Assertions.assertEquals(Path.of("test/one/two"), home.asPath());
		Assertions.assertEquals(Path.of("test/one/two/three"), three.asPath());
		Assertions.assertEquals("three", three.toString());

		StorageDirectory four = three.createSubdirectory("four");
		Assertions.assertEquals(Path.of("test/one/two/three/four"), four.asPath());
		Assertions.assertEquals(Path.of("three/four"), Path.of(four.toString()));
		Assertions.assertEquals(Path.of("test/one/two/three"), four.getParentDirectory().asPath());

		StorageDirectory four1 = four.createNext();
		Assertions.assertEquals(Path.of("test/one/two/three/four_1"), four1.asPath());

		StorageDirectory four2 = four1.createNext();
		Assertions.assertEquals(Path.of("test/one/two/three/four_2"), four2.asPath());
	}

	@Test
	public void storageTestFiles() {
		FileStorage storage = new FileStorage(Path.of("test"));
		StorageDirectory dir = storage
			.getHomeDirectory()
			.createSubdirectory("one")
			.createSubdirectory("two");

		StorageFile file0 = dir.createFile("test.txt");
		Assertions.assertEquals(Path.of("test/one/two/test.txt"), file0.asPath());

		StorageFile file1 = file0.createNext();
		Assertions.assertEquals(Path.of("test/one/two/test_1.txt"), file1.asPath());
	}
}
