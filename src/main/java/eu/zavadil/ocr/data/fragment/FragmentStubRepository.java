package eu.zavadil.ocr.data.fragment;

import eu.zavadil.ocr.data.RepositoryBase;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FragmentStubRepository extends RepositoryBase<FragmentStub> {

	List<FragmentStub> findAllByDocumentId(int documentId);

	@Modifying
	@Transactional
	void deleteAllByDocumentId(int documentId);

}
