<?php

echo <<<GIS
<html>
<head>
<script type="text/javascript">
window.Api = window.Api || {};
window.Api.base = {};
window.Api.base.ViewerState = {};
window.Api.base.ViewerState.map = {};
window.Api.base.ViewerState.map.getExtent = function() {
    return { 'left': 20234, 'right': 20234, 'bottom': 40, 'top': 60};
}

</script>
</head>
<body><div style="width: 450px; height: 450px">GIS</div></body>
</html>
GIS;
