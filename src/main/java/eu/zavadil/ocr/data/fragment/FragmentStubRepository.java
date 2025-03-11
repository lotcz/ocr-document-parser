package eu.zavadil.ocr.data.fragment;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FragmentStubRepository extends org.springframework.data.jpa.repository.JpaRepository<FragmentStub, Integer> {

	List<FragmentStub> findAllByDocumentId(int documentId);

	@Modifying
	@Transactional
	void deleteAllByDocumentId(int documentId);

}
