<?php
namespace DIQA\FacetedSearch2;

use OutputPage;
use Skin;

class Setup {

    public static function initModules() {

        global $wgResourceModules;
        global $IP;

        $wgResourceModules['ext.diqa.facetedsearch2'] = array(
            'localBasePath' => "$IP/extensions/FacetedSearch2",
            'remoteExtPath' => 'FacetedSearch2',
            'position' => 'bottom',
            'scripts' => [
                'fs-react/dist/main.js',
            ],
            'styles' => [ 'skins/main.css' ],
            'dependencies' => [],
        );

    }

    public static function onBeforePageDisplay( OutputPage $out, Skin $skin ) {

        if (!is_null($out->getTitle()) && $out->getTitle()->isSpecial("FacetedSearch2")) {
            self::checkIfCompiled();
            $out->addModules('ext.diqa.facetedsearch2');
        }
    }

    private static function checkIfCompiled(): void
    {
        global $IP;
        if (!file_exists("$IP/extensions/FacetedSearch2/fs-react/dist/main.js")) {
            trigger_error("You need to build FacetedSearch2. See README");
            die();
        }
    }


}