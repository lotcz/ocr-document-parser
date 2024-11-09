package eu.zavadil.ocr.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface RepositoryBase<T extends EntityBase> extends JpaRepository<T, Integer> {

}
