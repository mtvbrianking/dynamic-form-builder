<!DOCTYPE html>
<html lang="en">

<head>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Form Builder Preview">
	<meta name="author" content="Brian Matovu">

	<title>Form Builder Preview</title>

	<link rel="stylesheet" href="../assets/css/bootstrap.min-3.3.4.css">

</head>

<body>

	<div class="container">

		<div class="row col-sm-offset-3 col-sm-6">

			<?php
				$form = file_get_contents('../forms/form.html');
				echo $form;
			?>

		</div>

	</div>

</body>

</html>