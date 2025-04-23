package eu.zavadil.ocr.data.parsed.folder;

import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FolderRepository extends org.springframework.data.jpa.repository.JpaRepository<Folder, Integer> {

	@Query("""
			select d
			from DocumentStubWithPages d
			where d.folderId = :folderId
		""")
	Page<DocumentStubWithPages> loadChildDocuments(@Param("folderId") int folderId, Pageable pr);

	Optional<Folder> findFirstByName(String name);

}
