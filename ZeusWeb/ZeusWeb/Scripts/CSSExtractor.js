$(document).ready(function () {
    $('html').keydown(function (e) {
        if (e.which == 71) {
            var pageElementsWithStyle = $('*[style]');
            $('html').append("<div id=\"DivResult\" title=\" Inline Css Found: " + pageElementsWithStyle.length + "\"></div>");

            var pageElementStyle = "";
            var finalCssString = "GStyle";
            pageElementsWithStyle.each(function (i) {
                pageElementStyle += finalCssString + i + "{" + $(this)[0].attributes["style"].nodeValue + "}\n";
            });
            $('#DivResult').html(pageElementStyle);
            $('#DivResult').dialog();
        }
    });
});