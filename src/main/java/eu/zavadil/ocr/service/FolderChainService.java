package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.folder.FolderChain;
import eu.zavadil.ocr.data.folder.FolderChainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FolderChainService extends BasicEntityCache<FolderChain> {

	@Autowired
	public FolderChainService(FolderChainRepository repository) {
		super(repository);
	}

}
