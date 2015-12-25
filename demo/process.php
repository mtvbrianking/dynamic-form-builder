<?php

require_once '../demo/jsonToHtml.php';

/* Read post json form data */
$jsonForm = isset($_POST['jsonForm']) ? $_POST['jsonForm'] : FALSE;

/* If this json data is missing, throw an exception */
if( empty($jsonForm) ) {
	throw new Exception("Error Processing Request, json form data not received", 1);
}

/* Save a copy of the json data as a file */
$jsonFormFile = fopen("../forms/form.json", "w") or die("Unable to open file!");
fwrite($jsonFormFile, $jsonForm);
fclose($jsonFormFile);

/* Process this json data convert it into html */
$processor = new JsonToHtml($jsonForm);

/* Retreive html data from processor */
$htmlForm = $processor->getHtmlForm();

/* Save a copy of the html form data as a file */
$htmlFormFile = fopen("../forms/form.html", "w") or die("Unable to open file!");
fwrite($htmlFormFile, $htmlForm);
fclose($htmlFormFile);