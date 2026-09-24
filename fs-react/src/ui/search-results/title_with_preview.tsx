import React, {useContext} from "react";
import {Document} from "app/common/response/document";
import {WikiContext} from "app/index";
import ConfigUtils from "app/util/config_utils";
import Span from "app/custom_ui/span";
import WikiLink from "app/ui/common/wiki_link";
import HtmlTooltip from "app/custom_ui/tooltips";
import ResourcePreview from "app/ui/search-results/resource_preview";

const TitleWithPreview = (prop: {
    doc: Document
}) => {
    const wikiContext = useContext(WikiContext);
    const showSolrScore = wikiContext.config['fs2gShowScore'];

    const score = showSolrScore ? "score: " + prop.doc.score : '';
    const hasFileResource = ConfigUtils.getFileResourceURL(prop.doc) !== undefined;
    const title = <Span sx={{'fontWeight':'bold'}} className={'fs-search-result-title'}>
        <WikiLink page={prop.doc}/>
    </Span>;
    let titleWithTooltip;
    if (hasFileResource) {
        titleWithTooltip = <HtmlTooltip title={<ResourcePreview doc={prop.doc}/>}>{title}</HtmlTooltip>
    } else if (showSolrScore) {
        titleWithTooltip = <HtmlTooltip title={<Span>{score}</Span>}>{title}</HtmlTooltip>
    } else {
        titleWithTooltip = title;
    }
    return <Span>{titleWithTooltip}</Span>;
}

export default TitleWithPreview;