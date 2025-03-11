package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.document.DocumentStub;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FolderStubRepository extends org.springframework.data.jpa.repository.JpaRepository<FolderStub, Integer> {

	@Query("""
			select f
			from FolderStub f
			where f.documentTemplateId = :templateId
			 and (f.parentId = :parentId or (:parentId is null and f.parentId is null))
		""")
	Page<FolderStub> loadChildFoldersByTemplate(@Param("parentId") Integer parentId, @Param("templateId") Integer templateId, Pageable pr);

	@Query("""
			select f
			from FolderStub f
			where f.parentId = :parentId or (:parentId is null and f.parentId is null)
		""")
	Page<FolderStub> loadChildFolders(@Param("parentId") Integer parentId, Pageable pr);

	@Query("""
			select d
			from DocumentStub d
			where d.folderId = :parentId
		""")
	Page<DocumentStub> loadChildDocuments(@Param("parentId") int parentId, Pageable pr);

	Optional<FolderStub> findFirstByName(String name);

	Optional<FolderStub> findFirstByNameAndParentId(String name, int parentId);
}
