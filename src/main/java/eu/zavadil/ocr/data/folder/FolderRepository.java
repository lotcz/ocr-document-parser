package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.RepositoryBase;
import eu.zavadil.ocr.data.document.DocumentStub;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FolderRepository extends RepositoryBase<Folder> {

	@Query("""
			select d
			from DocumentStub d
			where d.folderId = :folderId
		""")
	Page<DocumentStub> loadChildDocuments(@Param("folderId") int folderId, Pageable pr);

	Optional<Folder> findFirstByName(String name);

}
