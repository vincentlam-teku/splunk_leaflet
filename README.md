WebGL Globe code taken and modified from http://www.chromeexperiments.com/globe by Google

### Purpose
* Created for the [Splunk .conf 2014](http://conf.splunk.com/) session "I Want that Cool Viz in Splunk!"
* This app along with the .conf presentation will teach users the general strategy to take existing custom JS code and creating a reusable chart package for Splunk dashboards

### Instructions
If you want to use the 3D globe elsewhere, you must copy the contents of the appserver directory to the new app and make changes to the following files, replacing 'Leaflets' with your app name.

./appserver/static/autodiscover_globe.js:        "tween": "../app/Leaflets/Tween",
./appserver/static/autodiscover_globe.js:        "three": "../app/Leaflets/three.min",
./appserver/static/autodiscover_globe.js:        "detector": "../app/Leaflets/Detector",
./appserver/static/autodiscover_globe.js:        "globe": "../app/Leaflets/globe"
./appserver/static/webgl_globe/webgl_globe.js:   imgDir: SplunkUtil.make_url("/static/app/Leaflets") + '/'

Your view should contain at a minimum, the reference to the autodiscover_globe.sh such as:
<dashboard script="autodiscover_globe.js" stylesheet="globe.css">

### Usage

#### Search
* Provide latitudinal and longitudinal coordinates (i.e. from `iplocation`) and end the search with `| geostats count`

#### Options
* `managerid`: Reference the `id` of the search query (required)
* `lat_field`: Name of the latitude field (defaults to `latitude`)
* `lon_field`: Name of the longitude field (defaults to `longitude`)
* `count_field`: Name of the count field (defaults to `count`)
* `height`: Height of the panel (defaults to `800`)
* `zoom_level`: Controls how much to "group" the data together; possible values are from `0` to `9` or `max`, where `9` is the least grouping (defaults to `9`)
  * `zoom_level` is actually calculated from `geostats`
  * Imagine how when you zoom out and the data start "grouping" together, whereas zooming in "separates out" the data
  * In other words, a low `zoom_level` produces less lines; a high `zoom_level` produces more lines
  * `max` means to take the maximum available `zoom_level`
    * The maximum can be lower than 9 if the user uses `maxzoomlevel` argument for `geostat`
  * If JavaScript performance is an issue then filter out all but one zoom level (since `geostats` produces 10 layers of geographic data by default)
    * This can significantly reduce the amount of data that JavaScript needs to process (since the other 9 layers are geographical data are already filtered out)
    * For example, `... | geostats count | rex field=geobin "bin_id_zl_(?<zoom_level>\d)" | where zoom_level=9`

#### Example
<dashboard script="autodiscover_globe.js" stylesheet="globe.css">
<row>
  <panel>
    <html>
      Features:
      <ul>
        <li>The geographical data for the Globe is "feathered" by rounding and grouping the latitude and longitude to the nearest integer</li>
      </ul>
    </html>
  </panel>
  <panel>
    <html>
      <h2>Globe</h2>
      <div id="globe_search" class="splunk-manager" data-require="splunkjs/mvc/searchmanager" data-options='{
        "search": "sourcetype=yourSourceType | rename yourLatField as lat yourLongfield as lon | geostats count",
        "preview": true,
        "earliest_time": "0",
        "latest_time": "now"
      }'>
      </div>
      <div id="globe" class="splunk-view" data-require="app/Leaflet/webgl_globe/webgl_globe" data-options='{
        "managerid": "globe_search"
      }'>
      </div>
    </html>
  </panel>
</row>
...
```

### Known issues
* Resizing the window causes the globe to resize and center to the middle of the page (regardless of the panel positions)

### Thanks to
* Siegfried Puchbauer and Satoshi Kawasaki
  * I remember when Satoshi and I sat together discussing this at Microsoft Bootcamp.  A year later he showed me his great work.
  * Siegfried is always available to help when I wanted to know more about Leaflets and Splunk maps.
