![image](https://user-images.githubusercontent.com/26948028/75599283-0d559580-5a69-11ea-999b-cb561260c942.png)


# Pie Chart Input
Custom HTML Element for selecting percentages.

## Installation / Usage
Include `<script src="piechartinput.js"></script>` in the body of your html file.

The tag is `<pie-input>`, and the available attributes are `size` (in pixels), `values` (comma-separated list), `initial-angle` (in radians), `colors` (comma-separated list), `line-thickness` (in pixels), and `handle-radius` (in pixels).

Example:

```<pie-input size="300" values=".25, .45, .3" initial-angle="3.14" colors="red, blue, #00FF00" line-thickness="10" handle-radius="15"></pie-input>```

The `values` attribute is updated every time the input is manipulated, so they can be accessed with

```document.querySelector('pie-input').getAttribute('values')```
