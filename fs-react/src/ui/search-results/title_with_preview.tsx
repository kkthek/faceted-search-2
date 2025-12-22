import Span from "../../custom_ui/span";
import WikiLink from "../common/wiki_link";
import HtmlTooltip from "../../custom_ui/tooltips";
import ResourcePreview from "./resource_preview";
import React, {useContext} from "react";
import {Document} from "../../common/response/document";
import {WikiContext} from "../../index";
import ConfigUtils from "../../util/config_utils";
import {Typography} from "@mui/material";

const TitleWithPreview = (prop: {
    doc: Document
}) => {
    const wikiContext = useContext(WikiContext);
    const showSolrScore = wikiContext.config['fs2gShowSolrScore'];

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
    return <Typography>{titleWithTooltip}</Typography>;
}

export default TitleWithPreview;