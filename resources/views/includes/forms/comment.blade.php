<form id="newComment" class="ajax-form">
	<div id="commentError" class="text-danger"></div>
	<div class="form-floating mt-4 mb-3">
		<textarea class="form-control" id="comment" name="comment" style="height: 100px" placeholder="Leave a comment"></textarea>
		<label for="comment">Comment</label>
	</div>
	@if($showSubmit)
		<button id="commentSubmit" type="submit" class="btn btn-primary">Submit</button>
	@endif
</form>