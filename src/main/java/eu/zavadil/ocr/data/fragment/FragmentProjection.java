package eu.zavadil.ocr.data.fragment;

import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplateProjection;

public interface FragmentProjection {

	String getImagePath();

	String getText();

	FragmentTemplateProjection getFragmentTemplate();
}
